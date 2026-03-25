#!/usr/bin/env python3
"""
upload_timestamps.py — Upload generated verse timestamp JSON files to Supabase Storage.

Uploads from data/timestamps/{translation}/{bookId}/{chapter}.json
to the Supabase bucket: verse-timestamps/{translation}/{bookId}/{chapter}.json

Install:
    pip install requests python-dotenv

Usage:
    # Upload all WEB timestamps
    python scripts/upload_timestamps.py --translation web

    # Upload all BSB timestamps
    python scripts/upload_timestamps.py --translation bsb

    # Single chapter
    python scripts/upload_timestamps.py --translation web --book GEN --chapter 1

    # Upload all translations
    python scripts/upload_timestamps.py

Requires in .env:
    EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  (NOT the anon key)

Create the bucket first in Supabase Dashboard:
    Storage > New bucket > "verse-timestamps" > Public
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
except ImportError:
    sys.exit("Missing: pip install requests")

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass


BUCKET = "verse-timestamps"


def get_supabase_config() -> tuple[str, str]:
    url = os.environ.get("EXPO_PUBLIC_SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url:
        sys.exit("EXPO_PUBLIC_SUPABASE_URL not set in .env")
    if not key:
        sys.exit("SUPABASE_SERVICE_ROLE_KEY not set in .env")
    return url, key


def ensure_bucket_exists(supabase_url: str, service_key: str) -> None:
    """Create the bucket if it doesn't already exist."""
    headers = {
        "Authorization": f"Bearer {service_key}",
        "apikey": service_key,
        "Content-Type": "application/json",
    }
    # Check if bucket exists
    r = requests.get(f"{supabase_url}/storage/v1/bucket/{BUCKET}", headers=headers)
    if r.status_code == 200:
        return  # already exists

    # Create it as public
    payload = {"id": BUCKET, "name": BUCKET, "public": True}
    r = requests.post(f"{supabase_url}/storage/v1/bucket", headers=headers, json=payload)
    if r.status_code not in (200, 201):
        print(f"Warning: could not create bucket ({r.status_code}): {r.text}", file=sys.stderr)


def upload_file(
    local_path: Path,
    object_key: str,
    supabase_url: str,
    service_key: str,
) -> tuple[str, bool, str]:
    """Upload one file. Returns (key, success, reason)."""
    headers = {
        "Authorization": f"Bearer {service_key}",
        "apikey": service_key,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=31536000",
    }
    upload_url = f"{supabase_url}/storage/v1/object/{BUCKET}/{object_key}"

    try:
        with open(local_path, "rb") as f:
            data = f.read()

        # Try upsert (update if exists)
        r = requests.post(
            upload_url,
            headers={**headers, "x-upsert": "true"},
            data=data,
        )
        if r.status_code in (200, 201):
            return object_key, True, "uploaded"
        else:
            return object_key, False, f"HTTP {r.status_code}: {r.text[:100]}"
    except Exception as e:
        return object_key, False, str(e)


def collect_files(translation: str | None, book: str | None, chapter: int | None) -> list[Path]:
    ts_root = Path(__file__).parent.parent / "data" / "timestamps"

    if not ts_root.exists():
        sys.exit(f"No timestamp data found at {ts_root}. Run generate_timestamps.py first.")

    translations = [translation] if translation else ["web", "bsb"]
    files = []
    for tr in translations:
        tr_dir = ts_root / tr
        if not tr_dir.exists():
            continue
        if book:
            book_dir = tr_dir / book.upper()
            if chapter:
                p = book_dir / f"{chapter}.json"
                if p.exists():
                    files.append(p)
            else:
                files.extend(sorted(book_dir.glob("*.json")))
        else:
            files.extend(sorted(tr_dir.rglob("*.json")))

    return files


def main():
    parser = argparse.ArgumentParser(description="Upload verse timestamps to Supabase Storage")
    parser.add_argument("--translation", choices=["web", "bsb"],
                        help="Translation to upload (omit for both)")
    parser.add_argument("--book", help="Single book ID (e.g. GEN)")
    parser.add_argument("--chapter", type=int, help="Single chapter number")
    parser.add_argument("--workers", type=int, default=8,
                        help="Parallel upload workers (default: 8)")
    args = parser.parse_args()

    supabase_url, service_key = get_supabase_config()

    print("Checking Supabase bucket...")
    ensure_bucket_exists(supabase_url, service_key)

    files = collect_files(args.translation, args.book, args.chapter)
    if not files:
        sys.exit("No timestamp files found to upload.")

    ts_root = Path(__file__).parent.parent / "data" / "timestamps"
    total = len(files)
    done = 0
    succeeded = 0
    failed = []
    start_time = time.time()

    print(f"Uploading {total} files with {args.workers} workers...\n")

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(
                upload_file,
                f,
                str(f.relative_to(ts_root)),
                supabase_url,
                service_key,
            ): f
            for f in files
        }
        for future in as_completed(futures):
            key, ok, reason = future.result()
            done += 1
            if ok:
                succeeded += 1
            else:
                failed.append((key, reason))

            elapsed = time.time() - start_time
            eta = (elapsed / done) * (total - done) if done > 0 else 0
            status = "✓" if ok else "✗"
            print(f"  [{done:4d}/{total}] {status} {key:<40} ETA {eta:.0f}s", flush=True)

    print(f"\n{'─'*50}")
    print(f"Done: {succeeded} uploaded, {len(failed)} failed")

    if failed:
        print("\nFailed:")
        for key, reason in failed:
            print(f"  {key}: {reason}")


if __name__ == "__main__":
    main()
