#!/usr/bin/env python3
"""Download ASV text from Bolls.life API and save as data/asv_processed.json."""

from __future__ import annotations

import json
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT / "data" / "asv_processed.json"

# Book IDs must match the existing database (confirmed from bsb verses table)
BOOK_IDS = [
    "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA",
    "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST", "JOB", "PSA", "PRO",
    "ECC", "SNG", "ISA", "JER", "LAM", "EZK", "DAN", "HOS", "JOL", "AMO",
    "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL",
    "MAT", "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO", "GAL", "EPH",
    "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS",
    "1PE", "2PE", "1JN", "2JN", "3JN", "JUD", "REV",
]

API_BASE = "https://api.getbible.net/v2/asv/{book_num}.json"


def fetch_book(book_num: int, book_id: str) -> list[dict]:
    url = API_BASE.format(book_num=book_num)
    req = urllib.request.Request(url, headers={"User-Agent": "EveryBible/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())

    # getbible.net whole-book: {chapters: [{chapter, verses: [{chapter,verse,text}]}]}
    verses = []
    for ch in data["chapters"]:
        for v in ch["verses"]:
            verses.append({
                "b": book_id,
                "c": v["chapter"],
                "v": v["verse"],
                "t": v["text"].strip(),
            })
    return verses


def main() -> None:
    all_verses: list[dict] = []
    for i, book_id in enumerate(BOOK_IDS, start=1):
        print(f"  Fetching {book_id} ({i}/66)...", end=" ", flush=True)
        verses = fetch_book(i, book_id)
        all_verses.extend(verses)
        print(f"{len(verses)} verses")
        time.sleep(0.15)  # be polite to the API

    output = {"translation": "asv", "verses": all_verses}
    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")))
    print(f"\nSaved {len(all_verses)} verses → {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
