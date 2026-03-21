# Quick Task 1 Plan: Reader chrome corrections and draggable audio progress bars

## Objective

Tighten the premium reader/listen chrome so the top rail, bottom chapter transport, and audio scrubbers match the requested behavior without changing app routing or playback architecture.

## Scope

- update premium read chrome in `src/screens/bible/BibleReaderScreen.tsx`
- preserve existing chapter handoff and translation/audio flows
- add one shared draggable scrubber for chapter-level audio bars

## Out Of Scope

- app-wide design refresh
- library screen redesign
- mini-player behavior changes
- roadmap or state updates

## Tasks

### Task 1: Reproduce the chrome and scrubber regressions in automated source tests

Files: `src/screens/bible/bibleReaderChromeSource.test.ts`, `src/components/audio/audioProgressScrubberSource.test.ts`

Action: Start with failing assertions that lock the requested behavior: no small top `Library` dock, a centered translations/listenings entry under the `Listen / Read` rail, persistent left/right chapter arrows through collapsed read chrome, unified pill/arrow glass treatment, and shared draggable scrubber usage in the reader listen surface plus the reusable audio player bars.

Verify: `node --test --import tsx src/screens/bible/bibleReaderChromeSource.test.ts src/components/audio/audioProgressScrubberSource.test.ts` should fail on the current branch before implementation, then pass once Tasks 2 and 3 land.

Done: The requested UI corrections are encoded as automated regressions before implementation begins.

### Task 2: Correct the premium read chrome layout and collapse behavior

Files: `src/screens/bible/BibleReaderScreen.tsx`, `src/screens/bible/bibleReaderModel.ts`, `src/screens/bible/bibleReaderModel.test.ts`

Action: Replace the library dock with a centered translations/listenings entry under the mode rail, wire it to the existing translation/listening controls, keep the chapter arrows visible while the chapter pill collapses, and normalize the glass sizing/intensity/alignment so the expanded `Genesis 1` pill and arrow buttons feel like one bar instead of separate pieces. Only change motion helpers in `bibleReaderModel.ts` if needed to support persistent arrows cleanly.

Verify: `node --test --import tsx src/screens/bible/bibleReaderModel.test.ts src/screens/bible/bibleReaderChromeSource.test.ts src/services/audio/audioPlaybackTransitionSource.test.ts`

Done: Premium read mode matches the requested top and bottom chrome behavior without regressing chapter handoff.

### Task 3: Ship one shared draggable scrubber across chapter-level audio surfaces

Files: `src/components/audio/AudioProgressScrubber.tsx`, `src/components/audio/AudioPlayerBar.tsx`, `src/components/audio/AudioFirstChapterCard.tsx`, `src/screens/bible/BibleReaderScreen.tsx`, `src/components/audio/audioProgressScrubberSource.test.ts`

Action: Create a small shared scrubber component with drag tracking, live visual feedback, and release-to-seek behavior. Replace the tap-only progress bars in `AudioPlayerBar`, `AudioFirstChapterCard`, and listen-mode `BibleReaderScreen.tsx` with the shared scrubber while keeping existing timing text and playback wiring explicit.

Verify: `node --test --import tsx src/components/audio/audioProgressScrubberSource.test.ts src/screens/bible/bibleReaderChromeSource.test.ts`

Done: Chapter-level audio bars drag smoothly and seek correctly across the reader and shared audio surfaces.

## Verification

```bash
node --test --import tsx \
  src/screens/bible/bibleReaderModel.test.ts \
  src/screens/bible/bibleReaderChromeSource.test.ts \
  src/components/audio/audioProgressScrubberSource.test.ts \
  src/services/audio/audioPlaybackTransitionSource.test.ts

npx eslint \
  src/screens/bible/BibleReaderScreen.tsx \
  src/screens/bible/bibleReaderModel.ts \
  src/screens/bible/bibleReaderModel.test.ts \
  src/screens/bible/bibleReaderChromeSource.test.ts \
  src/components/audio/AudioProgressScrubber.tsx \
  src/components/audio/AudioPlayerBar.tsx \
  src/components/audio/AudioFirstChapterCard.tsx \
  src/components/audio/audioProgressScrubberSource.test.ts

npm run typecheck
```
