#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  bash scripts/testflight_external_gate.sh --app APP_ID --build-version BUILD_VERSION [options]

Required:
  --app APP_ID                     App Store Connect app ID
  --build-version BUILD_VERSION    TestFlight build version / CFBundleVersion

Optional:
  --group-name NAME                Beta group name to verify and attach (example: "External Testers")
  --group-id GROUP_ID              Beta group ID to verify and attach
  --send-notification-if-ready     Send TestFlight notifications if the build is already in external testing

Behavior:
  - Verifies the build exists and is VALID
  - Ensures the build is attached to the requested beta group
  - Enables auto-notify if it is currently off
  - Submits the build for external beta review when the build is ready for beta submission
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

APP_ID=""
BUILD_VERSION=""
GROUP_NAME=""
GROUP_ID=""
SEND_NOTIFICATION_IF_READY="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app)
      APP_ID="${2:-}"
      shift 2
      ;;
    --build-version)
      BUILD_VERSION="${2:-}"
      shift 2
      ;;
    --group-name)
      GROUP_NAME="${2:-}"
      shift 2
      ;;
    --group-id)
      GROUP_ID="${2:-}"
      shift 2
      ;;
    --send-notification-if-ready)
      SEND_NOTIFICATION_IF_READY="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$APP_ID" || -z "$BUILD_VERSION" ]]; then
  usage >&2
  exit 1
fi

require_command asc
require_command python3

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

BUILD_JSON="$TMP_DIR/builds.json"
asc builds list --app "$APP_ID" --sort -uploadedDate --limit 50 --output json > "$BUILD_JSON"

BUILD_RESULT="$(
  BUILD_VERSION_ENV="$BUILD_VERSION" python3 - "$BUILD_JSON" <<'PY'
import json
import os
import sys

payload = json.load(open(sys.argv[1], "r", encoding="utf-8"))
target = os.environ["BUILD_VERSION_ENV"]
matches = [item for item in payload.get("data", []) if item.get("attributes", {}).get("version") == target]

if not matches:
    sys.exit(2)

build = matches[0]
attrs = build.get("attributes", {})
print(build["id"])
print(attrs.get("processingState", ""))
print(attrs.get("uploadedDate", ""))
PY
)" || {
  echo "Build version $BUILD_VERSION was not found for app $APP_ID" >&2
  exit 1
}

BUILD_ID="$(echo "$BUILD_RESULT" | sed -n '1p')"
BUILD_PROCESSING_STATE="$(echo "$BUILD_RESULT" | sed -n '2p')"
BUILD_UPLOADED_DATE="$(echo "$BUILD_RESULT" | sed -n '3p')"

echo "build_id=$BUILD_ID"
echo "build_version=$BUILD_VERSION"
echo "build_processing_state=$BUILD_PROCESSING_STATE"
echo "build_uploaded_date=$BUILD_UPLOADED_DATE"

if [[ "$BUILD_PROCESSING_STATE" != "VALID" ]]; then
  echo "Build $BUILD_VERSION is not yet VALID in App Store Connect" >&2
  exit 1
fi

if [[ -z "$GROUP_ID" && -n "$GROUP_NAME" ]]; then
  GROUPS_JSON="$TMP_DIR/groups.json"
  asc testflight beta-groups list --app "$APP_ID" --output json > "$GROUPS_JSON"
  GROUP_ID="$(
    GROUP_NAME_ENV="$GROUP_NAME" python3 - "$GROUPS_JSON" <<'PY'
import json
import os
import sys

payload = json.load(open(sys.argv[1], "r", encoding="utf-8"))
target = os.environ["GROUP_NAME_ENV"]

for item in payload.get("data", []):
    if item.get("attributes", {}).get("name") == target:
        print(item["id"])
        break
PY
  )"
  if [[ -z "$GROUP_ID" ]]; then
    echo "Could not resolve beta group named '$GROUP_NAME'" >&2
    exit 1
  fi
fi

GROUP_HAS_BUILD="unknown"
if [[ -n "$GROUP_ID" ]]; then
  GROUP_BUILDS_JSON="$TMP_DIR/group-builds.json"
  asc testflight beta-groups relationships get --group-id "$GROUP_ID" --type builds --paginate --output json > "$GROUP_BUILDS_JSON"
  GROUP_HAS_BUILD="$(
    BUILD_ID_ENV="$BUILD_ID" python3 - "$GROUP_BUILDS_JSON" <<'PY'
import json
import os
import sys

payload = json.load(open(sys.argv[1], "r", encoding="utf-8"))
target = os.environ["BUILD_ID_ENV"]
ids = {item.get("id") for item in payload.get("data", [])}
print("true" if target in ids else "false")
PY
  )"
  echo "group_id=$GROUP_ID"
  echo "group_has_build=$GROUP_HAS_BUILD"

  if [[ "$GROUP_HAS_BUILD" != "true" ]]; then
    asc builds add-groups --build "$BUILD_ID" --group "$GROUP_ID" >/dev/null
    GROUP_HAS_BUILD="true"
    echo "group_build_attached=true"
  fi
fi

fetch_beta_detail() {
  local beta_detail_json="$TMP_DIR/build-beta-detail.json"
  asc testflight beta-details get --build "$BUILD_ID" --output json > "$beta_detail_json"

  python3 - "$beta_detail_json" <<'PY'
import json
import sys

payload = json.load(open(sys.argv[1], "r", encoding="utf-8"))
data = payload.get("data", {})
if isinstance(data, list):
    data = data[0] if data else {}
attrs = data.get("attributes", {})
print("auto_notify_enabled=" + str(attrs.get("autoNotifyEnabled", "")).lower())
print("internal_build_state=" + str(attrs.get("internalBuildState", "")))
print("external_build_state=" + str(attrs.get("externalBuildState", "")))
PY
}

eval "$(fetch_beta_detail)"

echo "auto_notify_enabled=$auto_notify_enabled"
echo "internal_build_state=$internal_build_state"
echo "external_build_state=$external_build_state"

if [[ "$auto_notify_enabled" != "true" ]]; then
  asc testflight beta-details update --id "$BUILD_ID" --auto-notify >/dev/null
  eval "$(fetch_beta_detail)"
  echo "auto_notify_enabled=$auto_notify_enabled"
fi

if [[ "$external_build_state" == "READY_FOR_BETA_SUBMISSION" ]]; then
  REVIEW_JSON="$TMP_DIR/review-submit.json"
  asc testflight review submit --build "$BUILD_ID" --confirm --output json > "$REVIEW_JSON"
  REVIEW_STATE="$(
    python3 - "$REVIEW_JSON" <<'PY'
import json
import sys

payload = json.load(open(sys.argv[1], "r", encoding="utf-8"))
print(payload.get("data", {}).get("attributes", {}).get("betaReviewState", ""))
PY
  )"
  echo "beta_review_state=$REVIEW_STATE"
  eval "$(fetch_beta_detail)"
  echo "external_build_state=$external_build_state"
fi

if [[ "$external_build_state" == "IN_BETA_TESTING" && "$SEND_NOTIFICATION_IF_READY" == "true" ]]; then
  asc testflight beta-notifications create --build "$BUILD_ID" >/dev/null
  echo "beta_notification_sent=true"
fi
