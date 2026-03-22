#!/usr/bin/env bash
# Upload BSB .m4a audio files to Supabase Storage bucket "bible-audio"
# Source pattern: BSB_XX_Abc_NNN.m4a
# Target path:    ss:///bible-audio/bsb/{BOOK_ID}/{chapter}.m4a
#
# Usage: bash scripts/upload-bsb-audio.sh [--dry-run]
#   --dry-run   Print what would be uploaded without actually uploading

set -euo pipefail

OT_DIR="/Users/dev/Desktop/Bible App!!!/Audio Bible/BSB-32kbps/BSB_00_Souer_OT"
NT_DIR="/Users/dev/Desktop/Bible App!!!/Audio Bible/BSB-32kbps/BSB_00_Souer_NT"
BUCKET="bible-audio"
TRANSLATION="bsb"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY RUN] No files will be uploaded."
fi

# Convert filename book abbreviation to canonical BOOK_ID
# Filename uses mixed-case 3-letter codes (e.g., Gen, Psa, 1Sa, Tts)
# App uses uppercase (e.g., GEN, PSA, 1SA, TIT) with Tts -> TIT as special case
book_abbr_to_id() {
  local abbr="$1"
  case "$abbr" in
    # Special case: Titus filename uses "Tts", app uses "TIT"
    Tts) echo "TIT" ;;
    # All others: uppercase the abbreviation directly
    # Single-letter prefix books (1Sa, 2Ki, etc.) already uppercase correctly
    *)
      # Use tr to uppercase
      echo "$abbr" | tr '[:lower:]' '[:upper:]'
      ;;
  esac
}

total=0
success=0
failed=0
index=0

# Count total files first
for dir in "$OT_DIR" "$NT_DIR"; do
  count=$(find "$dir" -maxdepth 1 -name "*.m4a" 2>/dev/null | wc -l | tr -d ' ')
  total=$((total + count))
done

echo "Found $total .m4a files to upload"
echo ""

upload_file() {
  local filepath="$1"
  local filename
  filename=$(basename "$filepath")

  # Parse: BSB_XX_Abc_NNN.m4a
  if [[ ! "$filename" =~ ^BSB_[0-9]+_([A-Za-z0-9]+)_([0-9]+)\.m4a$ ]]; then
    echo "  [SKIP] Unexpected filename format: $filename"
    return 0
  fi

  local book_abbr="${BASH_REMATCH[1]}"
  local chapter_padded="${BASH_REMATCH[2]}"

  # Strip leading zeros from chapter number
  local chapter=$((10#$chapter_padded))

  # Convert to canonical BOOK_ID
  local book_id
  book_id=$(book_abbr_to_id "$book_abbr")

  local target="ss:///${BUCKET}/${TRANSLATION}/${book_id}/${chapter}.m4a"
  index=$((index + 1))
  echo "  Uploading ${book_id}/${chapter}.m4a ... [$index/$total]"

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "    [DRY RUN] Would upload: $filename -> $target"
    success=$((success + 1))
    return 0
  fi

  if supabase --experimental storage cp "$filepath" "$target" 2>&1; then
    success=$((success + 1))
  else
    echo "  [ERROR] Failed to upload: $filename -> $target"
    failed=$((failed + 1))
  fi
}

for dir in "$OT_DIR" "$NT_DIR"; do
  while IFS= read -r filepath; do
    upload_file "$filepath"
  done < <(find "$dir" -maxdepth 1 -name "*.m4a" 2>/dev/null | sort)
done

echo ""
echo "Upload complete: $success succeeded, $failed failed, $total total"
if [[ $failed -gt 0 ]]; then
  echo "[WARNING] $failed files failed to upload - review errors above"
  exit 1
fi
