# Quick Task 7 Summary: Add bundled background music options to Bible listen mode

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- added a bundled background-music selector to the shared listen utility row
- persisted the selected background-music choice in the shared audio store
- added a dedicated looping background-music player that follows scripture narration state
- removed the old placeholder audio-options sheet from `BibleReaderScreen`
- bundled five offline-ready background tracks into the app
- recorded the original source pages and licenses for the bundled tracks

## Bundled options

- Off
- Ambient
- Piano
- Soft guitar
- Sitar
- Ocean waves

## Source pack

See `assets/audio/background/SOURCES.md`.

Current source mix:

- Ambient: `CC0` via OpenGameArt
- Piano: `CC0` via OpenGameArt
- Soft guitar: `CC0` via OpenGameArt
- Sitar: `CC-BY 3.0` via OpenGameArt
- Ocean waves: `CC0` via OpenGameArt

## Files Changed

- `src/components/audio/PlaybackControls.tsx`
- `src/components/audio/AudioFirstChapterCard.tsx`
- `src/components/audio/AudioPlayerBar.tsx`
- `src/hooks/useAudioPlayer.ts`
- `src/services/audio/backgroundMusicCatalog.ts`
- `src/services/audio/backgroundMusicPlayer.ts`
- `src/services/audio/backgroundMusicCatalog.test.ts`
- `src/services/audio/index.ts`
- `src/stores/audioStore.ts`
- `src/stores/persistedStateSanitizers.ts`
- `src/stores/persistedStateSanitizers.test.ts`
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/screens/bible/bibleReaderChromeSource.test.ts`
- `src/components/audio/playbackControlsSource.test.ts`
- `src/types/audio.ts`
- `assets/audio/background/*`
- `assets/audio/background/SOURCES.md`
- `.planning/quick/7-add-bundled-background-music-options-to-/7-CONTEXT.md`
- `.planning/quick/7-add-bundled-background-music-options-to-/7-PLAN.md`
- `.planning/quick/7-add-bundled-background-music-options-to-/7-SUMMARY.md`

## Verification

```bash
node --test --import tsx src/components/audio/playbackControlsSource.test.ts src/stores/persistedStateSanitizers.test.ts src/services/audio/backgroundMusicCatalog.test.ts src/screens/bible/bibleReaderChromeSource.test.ts
npm run typecheck
npm run lint
```
