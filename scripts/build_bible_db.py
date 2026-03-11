#!/usr/bin/env python3
"""Build or verify the bundled Bible SQLite database asset."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
INPUT_PATH = ROOT / "data" / "bsb_processed.json"
OUTPUT_PATH = ROOT / "assets" / "databases" / "bible-bsb-v2.db"
EXPECTED_VERSE_COUNT = 31086
SCHEMA_VERSION = 2


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true", help="Verify the existing database asset")
    return parser.parse_args()


def load_source_data() -> dict:
    with INPUT_PATH.open("r", encoding="utf-8") as source_file:
        return json.load(source_file)


def build_database() -> None:
    source = load_source_data()
    verses = source["verses"]

    if len(verses) != EXPECTED_VERSE_COUNT:
        raise SystemExit(
            f"Expected {EXPECTED_VERSE_COUNT} verses in {INPUT_PATH}, found {len(verses)}"
        )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = OUTPUT_PATH.with_suffix(".tmp.db")
    if temp_path.exists():
        temp_path.unlink()

    connection = sqlite3.connect(temp_path)

    try:
        connection.executescript(
            """
            PRAGMA journal_mode = DELETE;
            PRAGMA synchronous = OFF;

            CREATE TABLE metadata (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL
            );

            CREATE TABLE verses (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              book_id TEXT NOT NULL,
              chapter INTEGER NOT NULL,
              verse INTEGER NOT NULL,
              text TEXT NOT NULL,
              heading TEXT,
              UNIQUE(book_id, chapter, verse)
            );

            CREATE INDEX idx_verses_book_chapter ON verses(book_id, chapter, verse);
            CREATE VIRTUAL TABLE verses_fts USING fts5(
              text,
              content='verses',
              content_rowid='id',
              tokenize='unicode61'
            );
            """
        )

        connection.execute("BEGIN")
        connection.executemany(
            """
            INSERT INTO verses (book_id, chapter, verse, text, heading)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (
                    verse["b"],
                    verse["c"],
                    verse["v"],
                    verse["t"],
                    verse.get("h"),
                )
                for verse in verses
            ],
        )
        connection.executemany(
            "INSERT INTO metadata (key, value) VALUES (?, ?)",
            [
                ("translation_id", source["translation"]["id"]),
                ("translation_name", source["translation"]["name"]),
                ("verse_count", str(len(verses))),
                ("schema_version", str(SCHEMA_VERSION)),
            ],
        )
        connection.commit()

        connection.execute("INSERT INTO verses_fts(verses_fts) VALUES ('rebuild')")
        connection.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")
        connection.commit()
        connection.execute("VACUUM")
        connection.commit()
    finally:
        connection.close()

    temp_path.replace(OUTPUT_PATH)
    print(f"Built {OUTPUT_PATH}")


def verify_database() -> None:
    if not OUTPUT_PATH.exists():
        raise SystemExit(f"Missing database asset at {OUTPUT_PATH}")

    connection = sqlite3.connect(OUTPUT_PATH)
    try:
        user_version = connection.execute("PRAGMA user_version").fetchone()[0]
        verse_count = connection.execute("SELECT COUNT(*) FROM verses").fetchone()[0]
        fts_count = connection.execute("SELECT COUNT(*) FROM verses_fts").fetchone()[0]
        sample_hits = connection.execute(
            """
            SELECT COUNT(*)
            FROM verses_fts
            JOIN verses ON verses.id = verses_fts.rowid
            WHERE verses_fts MATCH 'beginning*'
            """
        ).fetchone()[0]
    finally:
        connection.close()

    if user_version != SCHEMA_VERSION:
        raise SystemExit(
            f"Expected schema version {SCHEMA_VERSION}, found {user_version}"
        )
    if verse_count != EXPECTED_VERSE_COUNT:
        raise SystemExit(
            f"Expected {EXPECTED_VERSE_COUNT} verses, found {verse_count}"
        )
    if fts_count != EXPECTED_VERSE_COUNT:
        raise SystemExit(
            f"Expected {EXPECTED_VERSE_COUNT} FTS rows, found {fts_count}"
        )
    if sample_hits < 1:
        raise SystemExit("Expected at least one FTS match for 'beginning*'")

    print(
        f"Verified {OUTPUT_PATH}: schema={user_version}, verses={verse_count}, fts_rows={fts_count}"
    )


def main() -> None:
    args = parse_args()
    if args.verify:
        verify_database()
    else:
        build_database()


if __name__ == "__main__":
    main()
