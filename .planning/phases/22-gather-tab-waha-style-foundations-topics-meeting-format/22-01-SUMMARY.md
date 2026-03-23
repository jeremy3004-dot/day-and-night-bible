---
phase: 22-gather-tab-waha-style-foundations-topics-meeting-format
plan: "01"
subsystem: gather-data-layer
tags: [gather, data, types, zustand, foundation, topics, bible-references]
dependency_graph:
  requires: []
  provides:
    - src/types/gather.ts
    - src/data/gatherFoundations.ts
    - src/data/gatherTopics.ts
    - src/stores/gatherStore.ts
  affects: []
tech_stack:
  added: []
  patterns:
    - Zustand persist store with AsyncStorage (same as fourFieldsStore pattern)
    - Typed BibleReference with bookId matching constants/books.ts IDs
    - Standardized meeting-format question templates as exported constants
key_files:
  created:
    - src/types/gather.ts
    - src/data/gatherFoundations.ts
    - src/data/gatherTopics.ts
    - src/stores/gatherStore.ts
  modified: []
decisions:
  - Split cross-chapter Bible references (Exodus 2:23-3:14, Isaiah 52:13-53:12) into two BibleReference objects each, one per chapter — consistent with the bookId+chapter+verse query shape used by the existing bibleDatabase service
  - Used GatherTopicCategoryName as a union type (not enum) to match existing TypeScript patterns in the codebase
  - infoBannerDismissed added to gatherStore state per CONTEXT.md UI spec (dismissable info banner on GatherScreen)
metrics:
  duration: "~2 minutes"
  completed_date: "2026-03-23"
  tasks_completed: 2
  files_created: 4
  files_modified: 0
---

# Phase 22 Plan 01: Gather Data Layer Summary

Defined the complete data contract for the Gather tab: TypeScript types for foundations/topics/lessons/Bible references, Foundation 1 fully populated with 14 Discovery Bible Study lessons mapped to BSB passages, standardized DBS meeting-format question templates, 5 topic categories with 23 topic stubs, and a Zustand progress store with AsyncStorage persistence.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Define Gather types and Foundation/Topic data files | e733743 | src/types/gather.ts, src/data/gatherFoundations.ts, src/data/gatherTopics.ts |
| 2 | Create gatherStore with lesson completion tracking | 9a69f10 | src/stores/gatherStore.ts |

## Artifacts

### src/types/gather.ts
Exports: `MeetingSectionType`, `BibleReference`, `GatherLesson`, `GatherFoundation`, `GatherTopic`, `GatherTopicCategoryName`, `GatherTopicCategory`

The `BibleReference` type uses `bookId` (e.g. `'GEN'`, `'EXO'`) matching the IDs in `src/constants/books.ts`, so downstream screens can query `bibleDatabase` directly.

### src/data/gatherFoundations.ts
Exports: `FELLOWSHIP_QUESTIONS` (4 items), `APPLICATION_QUESTIONS` (7 items), `gatherFoundations` (9 entries)

Foundation 1 is fully populated with 14 lessons spanning Genesis through Luke. Foundations 2–9 have correct titles, icons (Ionicons), and empty lesson arrays as stubs for future plans.

The two cross-chapter passages are split:
- `Exodus 2:23–3:14` → references for chapter 2 (v.23) and chapter 3 (v.1–14)
- `Isaiah 52:13–53:12` → references for chapter 52 (v.13) and chapter 53 (v.1–12)

### src/data/gatherTopics.ts
Exports: `gatherTopicCategories` (5 categories, 23 topics total)

| Category | Topics |
|----------|--------|
| Truth | Courage, Faith, Hope, Justice, Love, Obedience |
| Challenge | Anger, Crisis, Grief, Hurt, Reconciliation, Self Esteem, Stress |
| Money | Money and God, Money Advice, Giving, Marketplace |
| People | Marriage, Men, Parenting, Singles, Women, Youth |
| God | Character of God, Promises of God, Names of God |

All topics have `lessons: []` — lesson content is deferred per CONTEXT.md.

### src/stores/gatherStore.ts
Exports: `useGatherStore`

State shape: `completedLessons: Record<string, string[]>` (parentId → lessonId[]) and `infoBannerDismissed: boolean`. Actions: `markLessonComplete`, `unmarkLessonComplete`, `isLessonComplete`, `getCompletedCount`, `dismissInfoBanner`. Persists via AsyncStorage key `'gather-storage'`.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

| File | Item | Reason |
|------|------|--------|
| src/data/gatherFoundations.ts | Foundations 2–9: `lessons: []` | Lesson content for foundations 2-9 not provided in screenshots — intentional stub, to be populated by a future plan |
| src/data/gatherTopics.ts | All 23 topics: `lessons: []` | Topic lesson content deferred per CONTEXT.md — future plans will populate |

These stubs do not block the plan's goal (data contract definition). Downstream screens will render topic/foundation lesson counts via `lessonCount` and show empty state for `lessons.length === 0`. Foundation 1's 14 fully-populated lessons are immediately usable.

## Self-Check: PASSED

Files exist:
- src/types/gather.ts: FOUND
- src/data/gatherFoundations.ts: FOUND
- src/data/gatherTopics.ts: FOUND
- src/stores/gatherStore.ts: FOUND

Commits:
- e733743: FOUND
- 9a69f10: FOUND

TypeScript: no errors on all 4 files.
