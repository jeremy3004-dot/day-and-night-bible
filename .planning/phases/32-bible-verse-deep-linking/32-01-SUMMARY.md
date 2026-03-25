---
phase: 32-bible-verse-deep-linking
plan: 01
subsystem: navigation, bible-services
tags: [deep-linking, sharing, navigation, url-scheme, bible]
dependency_graph:
  requires: []
  provides: [deep-link-parser, linking-config, share-url]
  affects: [BibleReaderScreen, RootNavigator, bible-service-barrel, navigation-barrel]
tech_stack:
  added: []
  patterns: [pure-function-extraction-for-testability, slug-to-id-lookup-table, platform-conditional-share]
key_files:
  created:
    - src/services/bible/deepLinkParser.ts
    - src/services/bible/deepLinkParser.test.ts
    - src/navigation/buildBibleNavState.ts
    - src/navigation/linkingConfig.ts
    - src/navigation/linkingConfig.test.ts
  modified:
    - src/services/bible/index.ts
    - src/navigation/index.ts
    - src/navigation/RootNavigator.tsx
    - src/screens/bible/BibleReaderScreen.tsx
    - package.json
decisions:
  - Extract buildBibleNavState as pure function separate from linkingConfig to enable Node.js test runner compatibility (expo-linking imports react-native which cannot run in node)
  - Derive SLUG_TO_BOOK_ID at module scope from bibleBooks array rather than hardcoding — single source of truth
  - Add psalm alias separately since canonical name is Psalms but users expect psalm to work
metrics:
  duration: 6 minutes
  completed: "2026-03-25"
  tasks: 3
  files_changed: 10
requirements: [DEEP-01, DEEP-02, DEEP-03]
---

# Phase 32 Plan 01: Bible Verse Deep Linking Summary

## One-liner

Deep link scheme `com.everybible.app://bible/{bookSlug}/{chapter}/{verse?}` fully wired: slug parser with 66-book round-trip, custom React Navigation `getStateFromPath`, and share action that includes URL on iOS and Android.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create deep link parser service with tests | e9aaef8 | deepLinkParser.ts, deepLinkParser.test.ts, bible/index.ts |
| 2 | Create linking config and wire into RootNavigator | 8bf3895 | buildBibleNavState.ts, linkingConfig.ts, linkingConfig.test.ts, RootNavigator.tsx, navigation/index.ts |
| 3 | Upgrade share action to include deep link URL | d3b61aa | BibleReaderScreen.tsx |

## What Was Built

### deepLinkParser.ts

- `SLUG_TO_BOOK_ID`: module-level lookup map derived from `bibleBooks` array (66 books + `psalm` alias for `PSA`). Slug = `book.name.toLowerCase().replace(/\s/g, '')`.
- `BOOK_ID_TO_SLUG`: reverse map for building URLs.
- `parseBibleDeepLink(path)`: parses `/bible/{slug}/{chapter}/{verse?}` → `BibleDeepLinkTarget | null`. Returns null for unknown slugs, chapter < 1, or non-bible paths.
- `buildBibleDeepLink(bookId, chapter, verse?)`: builds `com.everybible.app://bible/{slug}/{chapter}[/{verse}]`. Returns `''` for unknown bookId.
- 18 unit tests covering DEEP-01 through DEEP-06, including complete 66-book round-trip.

### buildBibleNavState.ts + linkingConfig.ts

- `buildBibleNavState`: pure function (no react-native/expo-linking dependency) that converts a path to React Navigation state with `BibleBrowser` backstop + `BibleReader` params. Exported for testability.
- `linkingConfig`: `LinkingOptions<RootTabParamList>` with `prefixes: [Linking.createURL('/'), 'com.everybible.app://']` and custom `getStateFromPath` delegating to `buildBibleNavState`.
- `RootNavigator.tsx` now passes `linking={linkingConfig}` to `NavigationContainer`.
- 3 unit tests covering DEEP-07 (routing, 1CO variant, defaultParser fallthrough).

### BibleReaderScreen.tsx

- Added `Platform` to react-native imports.
- Imported `buildBibleDeepLink` from `../../services/bible`.
- Updated `handleShareChapter`: iOS passes `{ message: text, url }` (link preview in share sheet); Android passes `{ message: \`${text}\n${url}\` }` (URL appended since Android ignores `url` field). Defensive empty-string guard if `buildBibleDeepLink` returns `''`.

## Test Results

```
deepLinkParser.test.ts: 18 pass / 0 fail
linkingConfig.test.ts:   3 pass / 0 fail
test:release:          124 pass / 0 fail
tsc --noEmit:           clean
lint:                   clean (0 errors, pre-existing warnings only)
format:check:           clean
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] expo-linking pulls in react-native — cannot run in Node.js test runner**
- **Found during:** Task 2 test execution
- **Issue:** `linkingConfig.ts` imports `expo-linking` which transitively imports `react-native/index.js`, which uses Flow type syntax (`import typeof`) that esbuild cannot parse in the test context.
- **Fix:** Extracted the pure routing logic into `buildBibleNavState.ts` (no expo-linking dep). `linkingConfig.ts` imports from it. Test imports from `buildBibleNavState.ts` directly, bypassing the expo-linking dependency.
- **Files modified:** `src/navigation/buildBibleNavState.ts` (created), `src/navigation/linkingConfig.ts` (restructured), `src/navigation/linkingConfig.test.ts` (imports buildBibleNavState)
- **Commits:** 8bf3895

**2. [Rule 2 - Missing] test:release linkingConfig.test.ts kept being removed by external tool**
- **Found during:** Task 2 post-commit
- **Issue:** The `package.json` test:release line was being silently reverted to remove `linkingConfig.test.ts` by an external process between tool calls.
- **Fix:** Re-added `linkingConfig.test.ts` to `test:release` in each affected commit; final state confirmed in git log.
- **Note:** `deepLinkParser.test.ts` was successfully registered and persisted in all runs.

## Known Stubs

None — all slug/parser/URL logic is fully wired from real `bibleBooks` data.

## Self-Check: PASSED

All 5 created files found. All 3 task commits verified (e9aaef8, 8bf3895, d3b61aa). Test suite: 124/124 pass. TypeScript: clean. Lint: clean. Format: clean.
