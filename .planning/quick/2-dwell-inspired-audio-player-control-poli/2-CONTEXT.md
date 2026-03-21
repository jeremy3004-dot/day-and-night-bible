# Quick Task 2 Context: Dwell-inspired audio player control polish

## Request

Use the local Dwell reference recording in `~/Downloads/ScreenRecording_03-21-2026 16-18-52_1.MP4` to redesign the Bible listen controls so they feel closer to Dwell.

Requested changes:

- make the previous/play/next transport buttons look more like the Dwell buttons in the recording
- move the `Show text` control out of its own row and place it inline with the timer, repeat, and `1x` controls
- bring the utility controls lower on the screen so the player feels bottom-weighted like Dwell
- redesign the `Show text` control to use a Dwell-style “lyrics/text” graphic instead of the current plain button treatment

## Grounded reference notes

Reference video:
- `~/Downloads/ScreenRecording_03-21-2026 16-18-52_1.MP4`

Extracted frames:
- `/tmp/everybible-dwell-ref/frame-01.png` through `/tmp/everybible-dwell-ref/frame-08.png`
- contact sheet: `/tmp/everybible-dwell-ref/contact.png`
- gstack capture: `/tmp/everybible-dwell-ref/contact-gstack.png`

Observed Dwell patterns from the recording:

- the player is visually weighted toward the bottom of the screen rather than centered vertically
- the transport row is compact and iconic, with a prominent central play/pause control and quieter surrounding buttons
- the secondary controls live on one shared row under the transport, not split across multiple lines
- the text/lyrics toggle is icon-led and visually belongs with the other compact utilities rather than looking like a primary CTA
- the timer/repeat/speed/text controls all share a consistent, minimal visual language

## Current EveryBible state

Relevant files:
- `src/screens/bible/BibleReaderScreen.tsx`
- `src/components/audio/PlaybackControls.tsx`
- `src/components/audio/AudioFirstChapterCard.tsx`
- `src/components/audio/AudioPlayerBar.tsx`
- `src/components/audio/AudioProgressScrubber.tsx`

Current mismatches:

- `PlaybackControls` still uses generic Expo Ionicon transport controls instead of a Dwell-inspired transport treatment
- `Show text` is still rendered on its own row in listen mode inside `BibleReaderScreen.tsx`
- the utility row currently only contains speed, repeat, and timer
- the overall listen stack still has more vertical separation than the Dwell reference

## Planning stance

This should be handled as a focused listen-player polish task, not a whole-screen redesign. The goal is to keep EveryBible’s existing playback logic and navigation behavior, while changing the control composition, iconography, spacing, and visual hierarchy to match the Dwell-inspired target more closely.
