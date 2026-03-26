#!/usr/bin/env python3
"""
Batch timestamp generator — processes all chapters for a translation in parallel.

Usage:
  # All chapters for WEB
  python3 scripts/batch_timestamps.py --translation web

  # Single book
  python3 scripts/batch_timestamps.py --translation web --book GEN

  # Force regenerate existing
  python3 scripts/batch_timestamps.py --translation web --force

  # Control parallelism
  python3 scripts/batch_timestamps.py --translation web --workers 4

  # Via npm script:
  npm run generate-timestamps -- --translation web
  npm run generate-timestamps -- --translation web --book MAT --force
"""

import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

# All 66 canonical Bible books in order with chapter counts
BIBLE_BOOKS: list[tuple[str, int]] = [
    ("GEN", 50), ("EXO", 40), ("LEV", 27), ("NUM", 36), ("DEU", 34),
    ("JOS", 24), ("JDG", 21), ("RUT", 4),  ("1SA", 31), ("2SA", 24),
    ("1KI", 22), ("2KI", 25), ("1CH", 29), ("2CH", 36), ("EZR", 10),
    ("NEH", 13), ("EST", 10), ("JOB", 42), ("PSA", 150),("PRO", 31),
    ("ECC", 12), ("SNG", 8),  ("ISA", 66), ("JER", 52), ("LAM", 5),
    ("EZK", 48), ("DAN", 12), ("HOS", 14), ("JOL", 3),  ("AMO", 9),
    ("OBA", 1),  ("JON", 4),  ("MIC", 7),  ("NAM", 3),  ("HAB", 3),
    ("ZEP", 3),  ("HAG", 2),  ("ZEC", 14), ("MAL", 4),
    ("MAT", 28), ("MRK", 16), ("LUK", 24), ("JHN", 21), ("ACT", 28),
    ("ROM", 16), ("1CO", 16), ("2CO", 13), ("GAL", 6),  ("EPH", 6),
    ("PHP", 4),  ("COL", 4),  ("1TH", 5),  ("2TH", 3),  ("1TI", 6),
    ("2TI", 4),  ("TIT", 3),  ("PHM", 1),  ("HEB", 13), ("JAS", 5),
    ("1PE", 5),  ("2PE", 3),  ("1JN", 5),  ("2JN", 1),  ("3JN", 1),
    ("JUD", 1),  ("REV", 22),
]

SUPPORTED_TRANSLATIONS = {"web", "bsb"}


def get_output_path(translation_id: str, book_id: str, chapter: int) -> Path:
    chapter_str = str(chapter).zfill(3)
    return Path(f"assets/timestamps/{translation_id.upper()}/{book_id}_{chapter_str}.json")


def process_chapter(
    db_path: str,
    translation_id: str,
    book_id: str,
    chapter: int,
    force: bool,
) -> tuple[str, bool]:
    """Worker function — returns (label, success)."""
    import sys
    import os
    # Ensure the project root is on sys.path so `scripts` package is importable
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    from scripts.generate_timestamps import generate_chapter_timestamps  # type: ignore

    label = f"{book_id} {chapter}"
    out_path = get_output_path(translation_id, book_id, chapter)
    success = generate_chapter_timestamps(
        db_path=db_path,
        translation_id=translation_id,
        book_id=book_id,
        chapter=chapter,
        out_path=out_path,
        force=force,
    )
    return label, success


def write_manifest(translation_id: str, total: int, completed: int, failed: list[str]) -> None:
    manifest = {
        "translation": translation_id,
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "chapterCount": total,
        "completedChapters": completed,
        "failedChapters": failed,
    }
    manifest_path = Path(f"assets/timestamps/{translation_id.upper()}/manifest.json")
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nManifest written: {manifest_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Batch generate verse timestamps")
    parser.add_argument("--translation", required=True, choices=list(SUPPORTED_TRANSLATIONS),
                        help="Translation ID: web or bsb")
    parser.add_argument("--book", help="Limit to one book (e.g. GEN, MAT)")
    parser.add_argument("--force", action="store_true", help="Regenerate existing files")
    parser.add_argument("--workers", type=int, default=2,
                        help="Parallel workers (default: 2, keep low to avoid rate limiting)")
    parser.add_argument("--db", default="assets/databases/bible-bsb-v2.db",
                        help="Path to SQLite DB")
    args = parser.parse_args()

    books = BIBLE_BOOKS
    if args.book:
        books = [(b, c) for b, c in BIBLE_BOOKS if b == args.book.upper()]
        if not books:
            print(f"ERROR: Unknown book '{args.book}'", file=sys.stderr)
            sys.exit(1)

    # Build work list
    tasks: list[tuple[str, int]] = []
    for book_id, chapter_count in books:
        for ch in range(1, chapter_count + 1):
            out = get_output_path(args.translation, book_id, ch)
            if out.exists() and not args.force:
                continue  # skip without printing — manifest will show count
            tasks.append((book_id, ch))

    total_chapters = sum(c for _, c in books)
    already_done = total_chapters - len(tasks)
    print(f"Translation: {args.translation.upper()}")
    print(f"Total chapters: {total_chapters} | Already done: {already_done} | To process: {len(tasks)}")

    if not tasks:
        print("Nothing to do. Use --force to regenerate.")
        write_manifest(args.translation, total_chapters, total_chapters, [])
        return

    completed = already_done
    failed: list[str] = []
    start = time.time()

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(process_chapter, args.db, args.translation, book_id, ch, args.force): (book_id, ch)
            for book_id, ch in tasks
        }

        for future in as_completed(futures):
            book_id, ch = futures[future]
            try:
                label, success = future.result()
                if success:
                    completed += 1
                else:
                    failed.append(f"{book_id}_{ch}")
            except Exception as e:
                failed.append(f"{book_id}_{ch}")
                print(f"  ERROR {book_id} {ch}: {e}", file=sys.stderr)

            elapsed = time.time() - start
            print(
                f"[{completed}/{total_chapters}] {book_id} {ch} "
                f"({'OK' if (book_id + '_' + str(ch)) not in failed else 'FAIL'}) "
                f"— {elapsed:.1f}s elapsed",
                flush=True,
            )

    elapsed = time.time() - start
    print(f"\nDone in {elapsed:.1f}s — {completed} completed, {len(failed)} failed")
    if failed:
        print(f"Failed chapters: {', '.join(failed)}")

    write_manifest(args.translation, total_chapters, completed, failed)
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()
