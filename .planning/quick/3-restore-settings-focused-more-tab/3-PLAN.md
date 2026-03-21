# Quick Task 3 Plan: Restore settings-focused More tab

## Objective

Remove the saved-library hub and return the `More` tab to a cleaner settings/profile destination.

## Scope

- update `src/screens/more/MoreScreen.tsx`
- update `src/navigation/MoreStack.tsx`
- update `src/navigation/types.ts`
- remove reader references to the library route in `src/screens/bible/BibleReaderScreen.tsx`
- delete the obsolete `src/screens/more/LibraryScreen.tsx`

## Tasks

### Task 1: Add a failing regression test

Files:
- `src/screens/more/moreScreenSource.test.ts`

Action:
- assert that `MoreScreen` no longer includes `Saved Library`
- assert that `MoreStack` no longer registers a `Library` route
- assert that the reader no longer includes the saved-library action

### Task 2: Remove the saved-library hub

Files:
- `src/screens/more/MoreScreen.tsx`
- `src/navigation/MoreStack.tsx`
- `src/navigation/types.ts`
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/screens/more/LibraryScreen.tsx`

Action:
- delete the menu item, route, and reader action
- remove now-unused navigation typing
- delete the screen file

### Task 3: Verify

```bash
node --test --import tsx src/screens/more/moreScreenSource.test.ts src/screens/bible/bibleReaderChromeSource.test.ts
npm run typecheck
npm run lint
```
