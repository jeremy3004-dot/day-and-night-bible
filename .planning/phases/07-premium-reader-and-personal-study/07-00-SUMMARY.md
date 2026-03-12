# Summary 07-00: Creation-to-Christ Playlist And Reader/Home Restore

## Outcome

The Harvest experience now uses a cleaner chapter-only Creation-to-Christ journey with better narrative titles, and reader chapter navigation follows that journey from one chapter to the next. Home regains the welcome rhythm and chapter momentum stats while still surfacing Creation-to-Christ as a primary action.

## What Changed

- Replaced the previous minimal Creation-to-Christ list with a researched 13-chapter biblical arc and added chapter titles/summaries.
- Updated the Harvest/Course list rows to show the new title + chapter reference + summary structure.
- Added optional `playlistId` route context to BibleReader and implemented playlist-aware previous/next targets.
- Kept normal chapter navigation behavior when not in playlist context.
- Restored Home greeting/welcome copy and chapter progress stats card while preserving the focused Creation-to-Christ hero.

## Verification

- `npm run -s typecheck`
- `npm run -s lint -- src/navigation/types.ts src/screens/bible/BibleReaderScreen.tsx src/screens/bible/bibleReaderModel.ts src/screens/bible/bibleReaderModel.test.ts src/screens/home/HomeScreen.tsx src/screens/learn/CourseListScreen.tsx src/screens/learn/creationToChristPlaylist.ts src/screens/learn/creationToChristPlaylist.test.ts`
- `node --test --import tsx src/screens/learn/creationToChristPlaylist.test.ts src/screens/bible/bibleReaderModel.test.ts`
- `npm run -s release:verify`
