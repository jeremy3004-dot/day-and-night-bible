#!/usr/bin/env python3
"""
Extract verse text from bible-bsb-v2.db for a given translation/book/chapter.
Writes one verse per line (aeneas fragment format) to stdout or --out file.

Usage:
  python3 scripts/extract_verse_text.py \
    --db assets/databases/bible-bsb-v2.db \
    --translation web --book GEN --chapter 1

  python3 scripts/extract_verse_text.py \
    --db assets/databases/bible-bsb-v2.db \
    --translation web --book GEN --chapter 1 --out /tmp/GEN_001.txt
"""

import argparse
import sqlite3
import sys
from pathlib import Path


def extract_verses(db_path: str, translation_id: str, book_id: str, chapter: int) -> list[tuple[int, str]]:
    """Return [(verse_num, text), ...] ordered by verse number."""
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.execute(
            """
            SELECT verse, text
            FROM verses
            WHERE translation_id = ? AND book_id = ? AND chapter = ?
            ORDER BY verse
            """,
            (translation_id, book_id, chapter),
        )
        return cursor.fetchall()
    finally:
        conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract verse text for aeneas alignment")
    parser.add_argument("--db", required=True, help="Path to bible-bsb-v2.db")
    parser.add_argument("--translation", required=True, help="Translation ID (e.g. web, bsb)")
    parser.add_argument("--book", required=True, help="Book ID (e.g. GEN, MAT, 1CO)")
    parser.add_argument("--chapter", required=True, type=int, help="Chapter number")
    parser.add_argument("--out", help="Output file path (default: stdout)")
    parser.add_argument("--format", choices=["plain", "json"], default="plain",
                        help="Output format: plain (one verse per line) or json")
    args = parser.parse_args()

    db_path = Path(args.db)
    if not db_path.exists():
        print(f"ERROR: DB not found: {db_path}", file=sys.stderr)
        sys.exit(1)

    verses = extract_verses(str(db_path), args.translation, args.book, args.chapter)
    if not verses:
        print(
            f"ERROR: No verses found for {args.translation}/{args.book}/{args.chapter}",
            file=sys.stderr,
        )
        sys.exit(1)

    if args.format == "json":
        import json
        output = json.dumps({str(v): t for v, t in verses}, ensure_ascii=False, indent=2)
    else:
        # Plain: one verse text per line (aeneas fragment format)
        # aeneas expects one fragment per line; we strip newlines from verse text
        lines = [text.replace("\n", " ").strip() for _, text in verses]
        output = "\n".join(lines)

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(output, encoding="utf-8")
        print(f"Wrote {len(verses)} verses to {out_path}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
