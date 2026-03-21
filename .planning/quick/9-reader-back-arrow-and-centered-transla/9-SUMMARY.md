# Quick Task 9 Summary: Reader back arrow and centered translation chip

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- changed the premium reader top-left icon to a left-facing back arrow
- changed the translation chip to show only the active translation abbreviation
- centered the translation chip touch target under the `Listen / Read` rail
- added regression coverage for those premium reader chrome details

## Files Changed

- `src/screens/bible/BibleReaderScreen.tsx`
- `src/screens/bible/bibleReaderChromeSource.test.ts`
- `.planning/quick/9-reader-back-arrow-and-centered-transla/9-CONTEXT.md`
- `.planning/quick/9-reader-back-arrow-and-centered-transla/9-PLAN.md`
- `.planning/quick/9-reader-back-arrow-and-centered-transla/9-SUMMARY.md`

## Verification

```bash
node --test --import tsx src/screens/bible/bibleReaderChromeSource.test.ts
npx eslint src/screens/bible/BibleReaderScreen.tsx src/screens/bible/bibleReaderChromeSource.test.ts
npm run typecheck
```
