# Quick Task 3 Summary: Restore settings-focused More tab

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- removed the `Saved Library` entry from `MoreScreen`
- removed the `Library` route from the More stack and More navigation types
- removed the reader action that opened the saved library
- deleted `src/screens/more/LibraryScreen.tsx`, including the “Keep your listening path together…” content and the favorites/playlists/queue/history hub

## Files Changed

- `src/screens/more/MoreScreen.tsx`
- `src/navigation/MoreStack.tsx`
- `src/navigation/types.ts`
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/screens/bible/bibleReaderChromeSource.test.ts`
- `src/screens/more/moreScreenSource.test.ts`
- deleted `src/screens/more/LibraryScreen.tsx`

## Verification

```bash
node --test --import tsx src/screens/more/moreScreenSource.test.ts src/screens/bible/bibleReaderChromeSource.test.ts
npm run typecheck
npm run lint
```
