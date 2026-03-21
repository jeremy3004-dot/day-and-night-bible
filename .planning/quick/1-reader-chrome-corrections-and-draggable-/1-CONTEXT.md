# Quick Task 1: Reader chrome corrections and draggable audio progress bars - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Task Boundary

Polish the existing Bible reader chrome without changing routing, playback architecture, or roadmap scope.

Scope includes:
- replace the small `Library` button with a centered translations/listenings entry under the `Listen / Read` rail
- keep the read-mode left/right chapter arrows persistent while scrolling
- align the expanded `Genesis 1` chapter pill with the arrows and unify the pill/arrow glass treatment
- make the chapter-level audio progress bars draggable instead of tap-only

Out of scope:
- new screens or new library IA
- broader redesign outside the reader/listen chrome
- backend, sync, or roadmap-phase work
</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- This is a follow-up polish on the existing premium reader architecture from Phase 12.1, not a rewrite.
- The premium read top auxiliary action must stop being a `Library` shortcut.
- The replacement entry must sit centered below the `Listen / Read` rail and represent translations/listenings access.
- Left/right chapter arrows must stay visible while the reader chrome collapses on scroll.
- The bottom chapter pill and chapter arrows should read as one glass system with aligned sizing, spacing, and centering.
- Chapter-level audio progress bars should support drag scrubbing, not just tap-to-seek.

### Claude's Discretion

- Exact copy for the new centered entry, as long as it clearly communicates translations/listenings.
- Whether the new entry opens existing translation/audio actions directly or routes through the current chapter actions flow, as long as it no longer behaves like a library shortcut.
- The smallest shared scrubber abstraction that can serve the reader listen surface and the reusable audio cards without adding unnecessary complexity.
</decisions>

<specifics>
## Specific Ideas

- The main chrome hotspot is `src/screens/bible/BibleReaderScreen.tsx`; the small library dock is still rendered there.
- Existing source coverage already guards the premium reader chrome in `src/screens/bible/bibleReaderChromeSource.test.ts`.
- `src/components/audio/audioProgressScrubberSource.test.ts` already expects a shared `AudioProgressScrubber.tsx`, but that component does not exist yet.
- Shared chapter-level audio bars currently live in `src/components/audio/AudioPlayerBar.tsx` and `src/components/audio/AudioFirstChapterCard.tsx`; the reader listen-mode scrubber is still screen-local in `BibleReaderScreen.tsx`.
</specifics>
