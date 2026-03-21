# Quick Task 2 Plan: Dwell-inspired audio player control polish

## Objective

Refine the listen-mode player controls so they feel Dwell-inspired: bottom-weighted, compact, icon-forward, and rhythmically grouped, while preserving EveryBible’s existing playback logic and screen flow.

## Recommendation

Recommended approach: rebuild the chapter-only listen controls around a two-row player cluster.

- top row: previous / play-pause / next transport with Dwell-inspired sizing and visual hierarchy
- bottom row: `Show text`, timer, repeat, and speed in one inline utility strip

This is the best fit because it preserves our current architecture, matches the reference more closely than piecemeal icon swaps, and keeps the scope boilable.

## Scope

- update the listen-mode control composition in `src/screens/bible/BibleReaderScreen.tsx`
- redesign the chapter-only `PlaybackControls` visuals and layout in `src/components/audio/PlaybackControls.tsx`
- move the text-toggle action into the utility row for listen mode
- add or replace icon treatment for the text-toggle so it reads like a compact “lyrics/text” utility control
- tune spacing so the player cluster sits lower and feels more anchored to the bottom of the screen

## Out Of Scope

- changes to the premium read screen bottom bar
- changes to queue logic, repeat logic, timer logic, or playback state flow
- changing what `Show text` does after it is tapped
- redesigning the mini-player

## Tasks

### Task 1: Lock the Dwell-inspired control composition in source tests

Files:
- `src/components/audio/playbackControlsSource.test.ts`
- `src/screens/bible/bibleReaderChromeSource.test.ts`

Action:
- add failing assertions for a Dwell-inspired chapter-only transport treatment
- add failing assertions that the `Show text` control is inline with timer/repeat/speed instead of on a separate row
- add failing assertions that the standalone `listenActionsRow` / secondary CTA treatment is gone from listen mode

Verify:
```bash
node --test --import tsx \
  src/components/audio/playbackControlsSource.test.ts \
  src/screens/bible/bibleReaderChromeSource.test.ts
```

Done when:
- the desired layout is protected before implementation

### Task 2: Redesign the chapter-only transport row

Files:
- `src/components/audio/PlaybackControls.tsx`

Action:
- replace the current generic skip-back/skip-forward button treatment with a Dwell-inspired chapter transport treatment
- keep the current callback wiring and disabled-state behavior
- preserve the default variant for other surfaces unless the visual treatment should also be shared safely there

Verify:
```bash
node --test --import tsx src/components/audio/playbackControlsSource.test.ts
```

Done when:
- chapter-only playback controls read as a Dwell-inspired transport without changing playback behavior

### Task 3: Inline the text toggle with the utility row and lower the player cluster

Files:
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/components/audio/PlaybackControls.tsx`

Action:
- move `Show text` into the inline utility row beside timer, repeat, and speed
- redesign it as a compact icon-led utility button, using a text/lyrics-style graphic rather than the current large pill CTA
- reduce the vertical gap between transport and utility rows and pull the whole control cluster lower on the canvas to better match the Dwell reference

Verify:
```bash
node --test --import tsx \
  src/screens/bible/bibleReaderChromeSource.test.ts \
  src/components/audio/playbackControlsSource.test.ts
```

Done when:
- the listen-mode controls visually read as one coherent bottom-weighted player cluster

### Task 4: Run verification and visual QA

Files:
- same as above

Action:
- run targeted tests, typecheck, and lint
- if feasible during implementation, do a simulator or screenshot QA pass against the Dwell reference
- use gstack only as a support tool for reference capture / visual evidence, since the shipped surface is native rather than browser-first

Verify:
```bash
node --test --import tsx \
  src/screens/bible/bibleReaderChromeSource.test.ts \
  src/components/audio/playbackControlsSource.test.ts \
  src/components/audio/audioFirstChapterCardSource.test.ts \
  src/components/audio/audioProgressScrubberSource.test.ts

npm run typecheck
npm run lint
```

Done when:
- the updated player is protected by tests and the codebase is clean

## Assumptions

- we should preserve the current `Show text` action and only restyle/reposition it
- the Dwell-inspired transport should apply at minimum to the `chapter-only` listen layout
- we can use custom line/icon composition or SF/Ionicon primitives rather than importing a heavy icon dependency

## Best current execution path

1. Add failing source tests for inline text-toggle and Dwell-style chapter transport.
2. Refactor `PlaybackControls` so the `chapter-only` variant has a distinct visual layout.
3. Move the text toggle into the utility row in `BibleReaderScreen.tsx`.
4. Tune spacing and alignment so the controls sit lower and tighter.
5. Verify with tests, typecheck, and lint before any visual handoff.
