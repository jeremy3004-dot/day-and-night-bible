# Phase 14 Research: Backend-driven Bible content sync and offline pack delivery

**Date:** 2026-03-21
**Status:** Complete

## Summary

The current app already has the right local-first shape, but it assumes:
- one bundled SQLite Bible database
- a compile-time static translation list
- hardcoded audio providers
- foreground-only audio downloads

That means the best mobile architecture is not a rewrite. It is a controlled extension at four seams:

1. runtime translation catalog
2. installed-pack registry and versioned SQLite path resolution
3. manifest-driven audio source resolution
4. durable background download/install state

## Existing System Seams

### Text

- `src/services/bible/bibleDatabase.ts` owns SQLite open/import/query behavior and currently assumes one bundled DB file.
- `src/services/bible/bibleService.ts` is a thin facade and should stay stable if possible.
- `src/stores/bibleStore.ts` owns current translation selection but `downloadTranslation()` is still a stub.
- `src/constants/translations.ts` and `src/stores/persistedStateSanitizers.ts` currently assume translations are compile-time static.

### Audio

- `src/services/audio/audioRemote.ts` hardcodes provider URL rules.
- `src/services/audio/audioDownloadService.ts` and `src/services/audio/audioDownloadStorage.ts` download chapter MP3s into a local filesystem tree.
- `src/services/audio/audioService.ts` already does the correct local-first, remote-second source selection.
- `src/hooks/useAudioPlayer.ts` and `src/stores/audioStore.ts` should remain mostly unchanged if the audio source seam stays in `audioService.ts`.

## Gaps To Close

- No runtime translation catalog from backend
- No text-pack install or activation flow
- No pack metadata model for version, checksum/signature, active path, rollback target, or failure reason
- No durable install/download state across restart
- No background/reattach large-file download support
- No manifest verification step before activation
- No UI install/update states for remotely provisioned translations

## Recommended State Model

Per translation, the client should model:

- `remote_only`
- `downloading`
- `verifying`
- `installing`
- `installed`
- `failed`
- `rollback_available`

The active reader/search/player should always point at `activeInstalledVersion`, never the in-flight candidate.

## Package Fit

### `@kesha-antonov/react-native-background-downloader`

- Good fit for Expo SDK 54 / RN 0.81.5 / iOS 15.1.
- Meaningfully better than `expo-file-system` for large background downloads and resume/reattach behavior.
- Needs config-plugin/native review because the repo commits native projects and uses a custom `AppDelegate.swift`.

### `jose`

- Good fit for signed manifest verification.
- Prefer a narrow algorithm set and a device proof before making it load-bearing.
- If runtime constraints appear on a target device, phase can fall back to checksum verification temporarily without changing the overall pack architecture.

## Architectural Recommendations

### Minimal-Diff Seams

- Extend `bibleDatabase.ts` to resolve `translation -> sqlite file path` instead of one bundled DB.
- Replace static translation assumptions in `bibleStore.ts`, `translations.ts`, and persisted-state sanitizers with a runtime catalog plus a preserved seeded baseline.
- Keep `audioService.ts` as the single source-selection seam and feed it backend-manifest metadata instead of hardcoded providers.
- Introduce one pack-install registry instead of sprinkling install state across screens.

### Risks

1. Native/config-plugin drift when integrating the background downloader
2. JOSE runtime proof on Hermes/iOS/Android for the exact verification path
3. Silent corruption risk if install/rollback is not atomic
4. Persisted-state loss if runtime translations are not sanitized differently from compile-time translations

## Planning Implications

This phase should be executed in four plans:

1. catalog/signature/download foundation
2. SQLite text-pack install + rollback-safe routing
3. backend-driven audio source + background download lifecycle
4. UI states + release/device verification
