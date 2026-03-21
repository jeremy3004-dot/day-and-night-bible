# Quick Task 9 Plan: Reader back arrow and centered translation chip

## Objective

Align the premium reader top chrome with the requested navigation and translation behavior.

## Scope

- update `src/screens/bible/BibleReaderScreen.tsx`
- extend `src/screens/bible/bibleReaderChromeSource.test.ts`

## Tasks

### Task 1: Reproduce the chrome regressions in the source test

Files: `src/screens/bible/bibleReaderChromeSource.test.ts`

Action: Add failing assertions that require a left-facing back arrow, a centered translation-chip touch target, and a single current-translation label instead of a combined available-translation list.

### Task 2: Apply the minimal premium-reader chrome fix

Files: `src/screens/bible/BibleReaderScreen.tsx`

Action: Swap the premium top-left icon to `arrow-back`, feed the translation dock from the active translation label, and give the docked translation touch target its own centered style instead of the shared left-aligned glass-button helper.

## Verification

```bash
node --test --import tsx src/screens/bible/bibleReaderChromeSource.test.ts
npx eslint src/screens/bible/BibleReaderScreen.tsx src/screens/bible/bibleReaderChromeSource.test.ts
npm run typecheck
```
