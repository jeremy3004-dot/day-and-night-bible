---
phase: 26
plan: 01
subsystem: navigation, ux
tags: [bug-fix, navigation, stub-removal]
key-files:
  modified:
    - src/screens/more/AnnotationsScreen.tsx
    - src/screens/learn/LessonDetailScreen.tsx
decisions:
  - Remove note button entirely rather than wire incomplete infrastructure
---

# Phase 26 Plan 01: UX Completeness - Navigation Gaps Summary

## One-liner

Annotation cards now navigate to BibleReader with book/chapter/verse params; removed the "Note feature coming soon" Alert stub from LessonDetailScreen.

## Changes

### Fix 1 - AnnotationsScreen tap navigation

Added `navigateToBible` helper using `rootNavigationRef` (same pattern as `ReadingPlanDetailScreen` and `MiniPlayer`). Navigates to `Bible > BibleReader` with `bookId`, `chapter`, and `focusVerse` from the annotation. Wired as `onPress` on the annotation card `TouchableOpacity`.

**Files modified:** `src/screens/more/AnnotationsScreen.tsx`

### Fix 2 - LessonDetailScreen note button removal

Removed `Alert.alert('Note feature coming soon')` stub, the `onAddNote` prop from `ApplicationSectionProps`, its parameter from `ApplicationSection`, the `idx === 3` "Add Note" button branch, the `onAddNote` call site, and the now-unused `Alert` import.

**Files modified:** `src/screens/learn/LessonDetailScreen.tsx`

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None introduced. The "Add Note" stub was removed rather than replaced.

## Verification

- `npm run typecheck` — passed (no errors)
- `npm run lint` — no new errors (7 pre-existing errors in Supabase Deno function unaffected)

## Self-Check: PASSED

Both modified files exist and typecheck passes cleanly.
