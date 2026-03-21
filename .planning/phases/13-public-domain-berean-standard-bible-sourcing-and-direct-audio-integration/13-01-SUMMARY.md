# Plan 13-01 Summary

## Outcome

EveryBible no longer relies on `Bible.is` for its built-in BSB audio path. The app now resolves BSB chapter playback/download URLs directly from the public MP3 source exposed through the official BSB audio ecosystem, and the repo's licensing/docs now reflect the verified Berean public-domain text and CC0 audio status.

## Changes

- Added direct BSB audio coverage in `src/services/audio/audioRemote.test.ts` for:
  - Genesis 1
  - 1 Corinthians 13
  - Psalm 150
  - runtime availability without `Bible.is`
- Extended `src/types/bible.ts` with a dedicated direct BSB audio provider type.
- Updated `src/constants/translations.ts` so `bsb` now uses the direct public-source provider and corrected the BSB copyright text.
- Updated `src/services/audio/audioRemote.ts` to build deterministic Bob Souer BSB chapter MP3 URLs from public `openbible.com` files instead of falling back to Bible.is for `bsb`.
- Refreshed repo copy in `README.md`, `.env.example`, `legal/terms.html`, `CLAUDE.md`, and `store-assets/app-store-listing.md` so BSB is no longer described as Bible.is-backed.
- Added Phase 13 planning artifacts to capture the verified public-domain sources and the follow-up plan for replacing the older BSB text-refresh pipeline.
- Followed up the rollout bug where switching from WEB to BSB while audio was already playing kept the old WEB stream active:
  - `src/stores/audioStore.ts`, `src/stores/audioQueueModel.ts`, and `src/stores/persistedStateSanitizers.ts` now treat `translationId` as part of the persisted audio-track identity.
  - `src/hooks/useAudioPlayer.ts` now reloads, resumes, and advances audio with translation-aware queue entries instead of collapsing all tracks to `bookId:chapter`.
  - `src/screens/bible/BibleReaderScreen.tsx`, `src/screens/bible/bibleReaderModel.ts`, `src/components/audio/AudioPlayerBar.tsx`, `src/components/audio/AudioFirstChapterCard.tsx`, and `src/components/audio/MiniPlayer.tsx` now hand off active playback when the user changes translation and no longer present stale cross-translation playback state.

## Verification

- `node --test --import tsx src/services/audio/audioRemote.test.ts`
- `node --test --import tsx src/services/audio/audioRemote.test.ts src/services/audio/audioDownloadService.test.ts src/services/audio/audioAvailability.test.ts src/services/bible/presentation.test.ts src/stores/persistedStateSanitizers.test.ts`
- `npx eslint src/types/bible.ts src/constants/translations.ts src/services/audio/audioRemote.ts src/services/audio/audioRemote.test.ts`
- `node --test --import tsx src/screens/bible/bibleReaderModel.test.ts src/stores/audioQueueModel.test.ts src/stores/persistedStateSanitizers.test.ts`
- `node --test --import tsx src/services/audio/audioRemote.test.ts src/services/audio/audioDownloadService.test.ts src/services/audio/audioAvailability.test.ts src/services/bible/presentation.test.ts src/stores/persistedStateSanitizers.test.ts src/stores/audioQueueModel.test.ts src/screens/bible/bibleReaderModel.test.ts`
- `npx eslint src/hooks/useAudioPlayer.ts src/stores/audioStore.ts src/stores/audioQueueModel.ts src/stores/persistedStateSanitizers.ts src/screens/bible/bibleReaderModel.ts src/screens/bible/BibleReaderScreen.tsx src/components/audio/AudioPlayerBar.tsx src/components/audio/AudioFirstChapterCard.tsx src/components/audio/MiniPlayer.tsx`
- `npm run typecheck`

## Remaining Manual Checks

- On device, stream BSB audio for at least one standard chapter, one Psalms chapter, and one numbered NT book.
- While WEB audio is already playing, switch to the same chapter in BSB and confirm playback immediately reloads to the BSB source instead of resuming the old WEB stream.
- Download BSB audio for at least one book, then disable network and confirm offline playback still works.
- Confirm installs with previously downloaded BSB audio still behave correctly because local files remain preferred over remote URLs.

## Next Plan

- **13-02:** replace `scripts/process-bsb.js`'s older local-source dependency with an official Berean download/import pipeline and regenerate bundled BSB text artifacts from first-party files.
