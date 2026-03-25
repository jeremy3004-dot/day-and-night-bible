---
phase: 30-animated-chapter-swipe-and-reader-gestures
plan: "01"
subsystem: bible-reader
tags: [gesture, animation, reanimated, testing, infrastructure]
dependency_graph:
  requires: []
  provides:
    - react-native-reanimated@3.19.5 (Old Architecture compatible)
    - react-native-gesture-handler@2.28.0
    - GestureHandlerRootView as app root wrapper
    - resolveSwipeChapterNavigation pure function
    - SWIPE_THRESHOLD and SWIPE_VELOCITY_MIN constants
  affects:
    - App.tsx (outermost provider tree)
    - src/screens/bible/bibleReaderModel.ts (new swipe exports)
    - test:release suite (71 tests, was 62)
tech_stack:
  added:
    - react-native-reanimated@~3.19.5
    - react-native-gesture-handler@~2.28.0
  patterns:
    - GestureHandlerRootView as outermost app wrapper with StyleSheet.create style
    - Pure function swipe logic in model layer (no React dependency, fully testable in Node)
    - node:test + node:assert/strict test pattern (matching project conventions)
key_files:
  created:
    - src/screens/bible/bibleReaderSwipeModel.test.ts
  modified:
    - App.tsx
    - src/screens/bible/bibleReaderModel.ts
    - package.json
    - package-lock.json
decisions:
  - Pin reanimated to ~3.19.5 explicitly to prevent npx expo install from resolving to 4.x (which requires New Architecture and crashes on newArchEnabled=false builds)
  - Place swipe logic in bibleReaderModel.ts alongside existing reader model constants rather than a new file, keeping the model surface cohesive
  - Test 9 cases instead of the minimum 7 to cover the constant values explicitly
metrics:
  duration: "~3 minutes"
  completed: "2026-03-25"
  tasks_completed: 2
  files_modified: 5
---

# Phase 30 Plan 01: Gesture Foundation and Swipe Model Summary

Installed react-native-reanimated 3.19.5 and react-native-gesture-handler 2.28.0, wired GestureHandlerRootView into the app root, and exported a tested pure-function swipe navigation model from bibleReaderModel.ts.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install native packages and add GestureHandlerRootView | 4c1e0dc | package.json, App.tsx |
| 2 | Add swipe navigation model with unit tests | 6789197 | bibleReaderModel.ts, bibleReaderSwipeModel.test.ts, package.json |

## What Was Built

**Packages installed:**
- `react-native-reanimated@~3.19.5` — pinned to 3.x to remain compatible with `newArchEnabled: false`; Expo SDK 54 would default to 4.1.x which crashes on Old Architecture
- `react-native-gesture-handler@~2.28.0` — Expo SDK 54 bundled version, single install verified via `npm ls`

**App.tsx changes:**
- `GestureHandlerRootView` added as the outermost element wrapping `QueryClientProvider` and the full provider tree
- `style={styles.gestureRoot}` applied via `StyleSheet.create` (required for non-zero gesture area; CLAUDE.md mandates no inline styles)

**bibleReaderModel.ts additions:**
- `SWIPE_THRESHOLD = 80` (px to commit chapter change)
- `SWIPE_VELOCITY_MIN = 600` (px/s velocity fast-path)
- `SwipeNavigationResult` type (`'next' | 'prev' | null`)
- `resolveSwipeChapterNavigation()` pure function — resolves swipe gesture end-state to a navigation direction or null

**bibleReaderSwipeModel.test.ts:**
- 9 tests using `node:test` + `node:assert/strict` (matches existing project test pattern)
- Covers: threshold-based next, threshold-based prev, velocity fast-path next, velocity fast-path prev, boundary guard (no next chapter), boundary guard (no prev chapter), small gesture returns null, and explicit constant value assertions

**package.json:**
- `bibleReaderSwipeModel.test.ts` added to `test:release` glob list — SWIPE-01/02/03 requirements now permanently covered by the release suite

## Verification Results

```
npm run typecheck → clean (0 errors)
node --test --import tsx src/screens/bible/bibleReaderSwipeModel.test.ts → 9/9 pass
npm run test:release → 71/71 pass (was 62)
prettier --check → all files formatted correctly
```

## Deviations from Plan

None — plan executed exactly as written. The test file was placed at `src/screens/bible/bibleReaderSwipeModel.test.ts` as specified (the RESEARCH.md mentioned `__tests__/` subdirectory but the PLAN.md used the flat location matching other test files in this directory).

## Known Stubs

None. This plan provides foundation infrastructure only. No UI stubs or placeholder data flows were introduced.

## Self-Check: PASSED

- `App.tsx` contains `GestureHandlerRootView` import: confirmed
- `bibleReaderModel.ts` exports `resolveSwipeChapterNavigation`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_MIN`: confirmed
- `bibleReaderSwipeModel.test.ts` exists with 9 tests: confirmed
- Commit `4c1e0dc` exists: confirmed
- Commit `6789197` exists: confirmed
- `package.json` test:release includes swipe test: confirmed
- `npm ls react-native-reanimated` shows single version `3.19.5`: confirmed
