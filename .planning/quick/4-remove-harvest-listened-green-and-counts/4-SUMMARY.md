# Quick Task 4 Summary: Remove Harvest listened-green state and counts

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- removed progress-store driven completion decoration from the Harvest course list
- removed the Harvest hero read-count chip
- removed section-level `x/y Read` progress text
- kept Harvest rows on a neutral play/open affordance instead of a green completion check

## Files Changed

- `src/screens/learn/CourseListScreen.tsx`
- `src/screens/learn/courseListSource.test.ts`
- `.planning/quick/4-remove-harvest-listened-green-and-counts/4-CONTEXT.md`
- `.planning/quick/4-remove-harvest-listened-green-and-counts/4-PLAN.md`
- `.planning/quick/4-remove-harvest-listened-green-and-counts/4-SUMMARY.md`

## Verification

```bash
node --test --import tsx src/screens/learn/courseListSource.test.ts
npm run typecheck
npm run lint
```
