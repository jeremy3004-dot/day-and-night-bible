# Quick Task 1 Summary: Reader chrome corrections and draggable audio progress bars

## Status

Completed on `main` working tree.

## Delivered

- replaced the under-rail `Library` pill in premium read mode with a centered translation-list pill that opens translation selection
- converted the premium read bottom chrome into one persistent glass bar so the left/right chapter arrows remain visible while scrolling
- centered the chapter title inside that bottom bar and removed the separate collapsed chapter pill
- unified the glass treatment so the arrows and chapter bar share the same blur/opacity surface
- added a shared `AudioProgressScrubber` and wired it into:
  - `src/screens/bible/BibleReaderScreen.tsx`
  - `src/components/audio/AudioPlayerBar.tsx`
  - `src/components/audio/AudioFirstChapterCard.tsx`
- changed chapter-level audio progress from tap-only seek to drag-to-seek with release-to-commit behavior

## Files Changed

- `src/screens/bible/BibleReaderScreen.tsx`
- `src/components/audio/AudioProgressScrubber.tsx`
- `src/components/audio/AudioPlayerBar.tsx`
- `src/components/audio/AudioFirstChapterCard.tsx`
- `src/components/audio/index.ts`
- `src/screens/bible/bibleReaderChromeSource.test.ts`
- `src/components/audio/audioProgressScrubberSource.test.ts`

## Verification

```bash
node --test --import tsx \
  src/screens/bible/bibleReaderModel.test.ts \
  src/screens/bible/bibleReaderChromeSource.test.ts \
  src/components/audio/audioProgressScrubberSource.test.ts \
  src/components/audio/audioFirstChapterCardSource.test.ts \
  src/components/audio/playbackControlsSource.test.ts \
  src/services/audio/audioPlaybackTransitionSource.test.ts \
  src/stores/audioPlaybackCompletionModel.test.ts \
  src/stores/persistedStateSanitizers.test.ts

npm run typecheck
npm run lint
```

## Notes

- the translation pill label now summarizes the currently listenable translations for the displayed book using abbreviations such as `BSB • WEB`
- the draggable scrubber previews progress while dragging and commits the actual seek on release to avoid flooding the audio engine with position writes
- no simulator/device visual QA was run in this quick task
