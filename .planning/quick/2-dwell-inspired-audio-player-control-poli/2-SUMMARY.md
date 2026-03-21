# Quick Task 2 Summary: Dwell-inspired audio player control polish

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- redesigned the `chapter-only` transport in `src/components/audio/PlaybackControls.tsx` so the previous/play/next controls have a stronger Dwell-inspired hierarchy
- moved the listen-mode `Show text` action into the inline utility row beside timer, repeat, and playback speed
- replaced the old standalone `Show text` CTA row in `src/screens/bible/BibleReaderScreen.tsx`
- anchored the listen player cluster lower in the screen by pushing the listen player card toward the bottom
- added a compact icon-led text utility control with a Dwell-inspired speech/text graphic treatment
- preserved the existing playback callbacks, repeat behavior, sleep timer behavior, and follow-along sheet behavior

## Files Changed

- `src/components/audio/PlaybackControls.tsx`
- `src/components/audio/playbackControlsSource.test.ts`
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/screens/bible/bibleReaderChromeSource.test.ts`

## Reference Inputs

- Dwell reference video: `~/Downloads/ScreenRecording_03-21-2026 16-18-52_1.MP4`
- extracted frames: `/tmp/everybible-dwell-ref/`
- gstack capture: `/tmp/everybible-dwell-ref/contact-gstack.png`

## Verification

```bash
node --test --import tsx \
  src/screens/bible/bibleReaderModel.test.ts \
  src/screens/bible/bibleReaderChromeSource.test.ts \
  src/components/audio/playbackControlsSource.test.ts \
  src/components/audio/audioFirstChapterCardSource.test.ts \
  src/components/audio/audioProgressScrubberSource.test.ts \
  src/services/audio/audioPlaybackTransitionSource.test.ts \
  src/stores/audioPlaybackCompletionModel.test.ts

npm run typecheck
npm run lint
```

## Notes

- this pass was scoped to the Bible listen player and `chapter-only` transport treatment, not a full app-wide audio redesign
- no simulator/device screenshot pass was run in this quick task
