# Quick Task 6 Summary: Remove bottom tab corner gaps

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- removed the rounded top-corner styling from the shared root tab bar
- kept the rest of the tab bar styling unchanged
- added a regression test so the corner radii do not come back

## Files Changed

- `src/navigation/TabNavigator.tsx`
- `src/navigation/tabNavigatorSource.test.ts`
- `.planning/quick/6-remove-bottom-tab-corner-gaps/6-CONTEXT.md`
- `.planning/quick/6-remove-bottom-tab-corner-gaps/6-PLAN.md`
- `.planning/quick/6-remove-bottom-tab-corner-gaps/6-SUMMARY.md`

## Verification

```bash
node --test --import tsx src/navigation/tabNavigatorSource.test.ts src/navigation/tabBarVisibility.test.ts
npm run typecheck
npm run lint
```
