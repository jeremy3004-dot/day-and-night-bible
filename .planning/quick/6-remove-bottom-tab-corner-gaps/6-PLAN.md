# Quick Task 6 Plan: Remove bottom tab corner gaps

## Objective

Remove the rounded top-corner styling from the shared root tab bar so the bottom navigation spans edge-to-edge cleanly.

## Scope

- add a regression test for the tab bar style
- update `src/navigation/TabNavigator.tsx`

## Tasks

### Task 1: Add a failing regression test

Files:
- `src/navigation/tabNavigatorSource.test.ts`

Action:
- assert that `TabNavigator` no longer includes `borderTopLeftRadius`
- assert that `TabNavigator` no longer includes `borderTopRightRadius`

### Task 2: Flatten the tab bar edge

Files:
- `src/navigation/TabNavigator.tsx`

Action:
- remove the rounded top corner styling from `defaultTabBarStyle`

### Task 3: Verify

```bash
node --test --import tsx src/navigation/tabNavigatorSource.test.ts src/navigation/tabBarVisibility.test.ts
npm run typecheck
npm run lint
```
