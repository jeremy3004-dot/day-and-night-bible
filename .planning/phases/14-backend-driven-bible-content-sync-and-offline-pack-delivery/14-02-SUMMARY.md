# Plan 14-02 Summary

## Outcome

Implemented the versioned text-pack activation seam while preserving current reader/search call sites.

- Added pack lifecycle helpers for staging, activation, failure, rollback, and installed-pack path derivation in [src/services/bible/bibleDataModel.ts](/Users/dev/Projects/EveryBible/src/services/bible/bibleDataModel.ts).
- Extended translation state to persist pending/rollback pack metadata in [src/types/bible.ts](/Users/dev/Projects/EveryBible/src/types/bible.ts) and [src/stores/persistedStateSanitizers.ts](/Users/dev/Projects/EveryBible/src/stores/persistedStateSanitizers.ts).
- Added store actions for applying runtime catalogs and pack lifecycle updates in [src/stores/bibleStore.ts](/Users/dev/Projects/EveryBible/src/stores/bibleStore.ts).
- Wired the Bible DB layer to a translation-aware installed-pack resolver via [src/services/bible/bibleDatabase.ts](/Users/dev/Projects/EveryBible/src/services/bible/bibleDatabase.ts), with bundled SQLite as the fallback.

## Tests

- `node --test --import tsx src/services/bible/bibleDataModel.test.ts src/services/bible/bibleDatabaseSource.test.ts src/services/bible/browserRows.test.ts src/screens/bible/bibleSearchModel.test.ts`
- `npm run typecheck`
- `npm run lint`

## Notes

- Installed text packs can now be represented as active local SQLite paths without changing reader or search call sites.
- The store-to-database bridge uses `setBibleDatabaseSourceResolver(...)`, so later download/install code only needs to update translation metadata for the DB layer to pick up the active pack.
