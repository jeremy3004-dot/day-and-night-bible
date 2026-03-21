import test from 'node:test';
import assert from 'node:assert/strict';
import { getTranslationSelectionState, isAudioOnlyTranslation } from './bibleTranslationModel';

test('downloaded translations are selectable', () => {
  const state = getTranslationSelectionState({
    isDownloaded: true,
    hasText: true,
    hasAudio: false,
    canPlayAudio: false,
  });

  assert.deepEqual(state, {
    isSelectable: true,
    reason: null,
  });
});

test('text translations remain selectable even when audio downloads are separate', () => {
  const state = getTranslationSelectionState({
    isDownloaded: false,
    hasText: true,
    hasAudio: false,
    canPlayAudio: false,
  });

  assert.deepEqual(state, {
    isSelectable: true,
    reason: null,
  });
});

test('audio-only translations are selectable when audio can play', () => {
  const state = getTranslationSelectionState({
    isDownloaded: false,
    hasText: false,
    hasAudio: true,
    canPlayAudio: true,
  });

  assert.deepEqual(state, {
    isSelectable: true,
    reason: null,
  });
});

test('audio-only translations are blocked when no audio source is available', () => {
  const state = getTranslationSelectionState({
    isDownloaded: false,
    hasText: false,
    hasAudio: true,
    canPlayAudio: false,
  });

  assert.deepEqual(state, {
    isSelectable: false,
    reason: 'audio-unavailable',
  });
});

test('audio-only helper flags only translations with audio and no text', () => {
  assert.equal(
    isAudioOnlyTranslation({
      hasText: false,
      hasAudio: true,
    }),
    true
  );

  assert.equal(
    isAudioOnlyTranslation({
      hasText: true,
      hasAudio: true,
    }),
    false
  );
});
