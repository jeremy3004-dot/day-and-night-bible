# Quick Task 7 Plan: Add bundled background music options to Bible listen mode

## Objective

Ship a bundled background-music picker for Bible listening that feels native to the existing player and works offline.

## Scope

- add failing tests for the new utility control and persisted setting
- bundle a vetted source pack and record licenses
- add background-music types, store state, and a second looping player
- wire the picker into listen surfaces

## Tasks

### Task 1: Add failing regressions

Files:
- `src/components/audio/playbackControlsSource.test.ts`
- `src/stores/persistedStateSanitizers.test.ts`
- `src/services/audio/backgroundMusicCatalog.test.ts`

Action:
- assert that `PlaybackControls` exposes a background-music utility beside the other listen controls
- assert that persisted audio state sanitizes invalid background-music values back to `off`
- assert that the bundled background-music catalog exposes the expected options and source metadata

### Task 2: Add bundled asset plumbing

Files:
- `src/types/audio.ts`
- `src/stores/audioStore.ts`
- `src/stores/persistedStateSanitizers.ts`
- `src/services/audio/backgroundMusicCatalog.ts`
- `src/services/audio/backgroundMusicPlayer.ts`
- `src/services/audio/index.ts`
- `assets/audio/background/*`
- `assets/audio/background/SOURCES.md`

Action:
- define the background-music choice type and persisted setting
- add a small catalog for bundled sources and credits
- add a second looping audio player dedicated to bundled background sounds

### Task 3: Wire the listen UI

Files:
- `src/components/audio/PlaybackControls.tsx`
- `src/components/audio/AudioFirstChapterCard.tsx`
- `src/components/audio/AudioPlayerBar.tsx`
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/hooks/useAudioPlayer.ts`

Action:
- add the new music-note utility button and in-place picker
- synchronize the background loop with narration play, pause, stop, and chapter changes
- remove the old placeholder audio-options copy path

### Task 4: Verify

```bash
node --test --import tsx src/components/audio/playbackControlsSource.test.ts src/stores/persistedStateSanitizers.test.ts src/services/audio/backgroundMusicCatalog.test.ts
npm run typecheck
npm run lint
```
