# Summary 06-01: Seeded Bible Data Bootstrap

## Outcome

The Bible experience no longer depends on destructive runtime JSON seeding. EveryBible now ships with a bundled versioned SQLite database asset, verifies readiness before use, and can recover older empty or partial local Bible databases by overwriting them from the bundled asset.

## What Changed

- Added `scripts/build_bible_db.py` to generate and verify `assets/databases/bible-bsb-v2.db`.
- Added Expo asset bundling support and direct `expo-asset` dependency so the seeded database is available in native builds.
- Reworked `bibleDatabase.ts` to import the bundled database asset, inspect schema/index readiness, and recover broken legacy local files.
- Reworked `bibleService.ts` so initialization can retry after failure instead of caching a rejected promise forever.
- Added `bibleDataModel.ts` tests for readiness and indexed-query normalization rules.
- Removed the old `loadBSBData` re-export from the live Bible service barrel so the large JSON path is no longer pulled into the runtime bundle.

## Verification

- `python3 scripts/build_bible_db.py --verify`
- `sqlite3 assets/databases/bible-bsb-v2.db "PRAGMA user_version; SELECT COUNT(*) FROM verses; SELECT COUNT(*) FROM verses_fts;"`
- `node --test --import tsx src/services/bible/bibleDataModel.test.ts`
- `npm run typecheck`
- `npm test`
