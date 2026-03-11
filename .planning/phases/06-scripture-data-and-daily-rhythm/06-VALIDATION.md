# Phase 6 Validation

## 06-01 Validation Targets

- Bundled Bible database file exists in the repo and can be regenerated from source content.
- Bible bootstrap no longer depends on destructive runtime JSON seeding.
- Broken or empty legacy local Bible databases can recover by re-importing the bundled asset.
- Search prefers indexed local lookup and still returns useful offline results.
- Targeted regression tests cover the readiness and search-query rules that drive the new bootstrap path.

## Suggested Verification Commands

```bash
python3 scripts/build_bible_db.py --verify
node --test --import tsx src/services/bible/bibleDataModel.test.ts
npm run typecheck
npx eslint src/services/bible/bibleService.ts src/services/bible/bibleDatabase.ts src/services/bible/bibleDataModel.ts src/services/bible/bibleDataModel.test.ts scripts/build_bible_db.py
sqlite3 assets/databases/bible-bsb-v2.db "PRAGMA user_version; SELECT COUNT(*) FROM verses; SELECT COUNT(*) FROM verses_fts;"
```

## 06-02 Validation Targets

- Home exposes one clear “today” action with stronger momentum and next-step visibility.
- Home reuses real reading, lesson, and audio state rather than static placeholder copy.
- Layout and copy remain readable in dark theme and on smaller screens.
