# Quick Task 4 Plan: Remove Harvest listened-green state and counts

## Objective

Make the Harvest chapter list feel simpler and less gamified by removing listened progress indicators.

## Scope

- add a regression test for Harvest course UI expectations
- update `src/screens/learn/CourseListScreen.tsx`

## Tasks

### Task 1: Add a failing regression test

Files:
- `src/screens/learn/courseListSource.test.ts`

Action:
- assert that `CourseListScreen` no longer uses Harvest read-count copy
- assert that it no longer renders section progress counters
- assert that it no longer uses the green completion check icon

### Task 2: Simplify Harvest section UI

Files:
- `src/screens/learn/CourseListScreen.tsx`

Action:
- remove progress-store driven Harvest completion state
- remove the hero read-count metric chip
- remove section-level progress text
- keep a neutral row affordance instead of the green completion check

### Task 3: Verify

```bash
node --test --import tsx src/screens/learn/courseListSource.test.ts
npm run typecheck
npm run lint
```
