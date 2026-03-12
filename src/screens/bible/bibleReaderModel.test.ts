import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPlaylistNavigationTargets,
  getNextFontSizeSheetVisibility,
  getNextTranslationSheetVisibility,
} from './bibleReaderModel';

test('toggles the font sheet from the font button', () => {
  assert.equal(getNextFontSizeSheetVisibility(false, 'toggleButton'), true);
  assert.equal(getNextFontSizeSheetVisibility(true, 'toggleButton'), false);
});

test('closes the font sheet when the reader content is tapped', () => {
  assert.equal(getNextFontSizeSheetVisibility(true, 'readerContentTap'), false);
  assert.equal(getNextFontSizeSheetVisibility(false, 'readerContentTap'), false);
});

test('closes the font sheet when chapter navigation or scrolling starts', () => {
  assert.equal(getNextFontSizeSheetVisibility(true, 'scrollStart'), false);
  assert.equal(getNextFontSizeSheetVisibility(true, 'chapterChange'), false);
});

test('opens the translation sheet from the header chip when multiple translations are enabled', () => {
  assert.equal(getNextTranslationSheetVisibility(false, true, 'toggleChip'), true);
  assert.equal(getNextTranslationSheetVisibility(true, true, 'toggleChip'), false);
});

test('keeps the translation sheet closed when translation switching is unavailable', () => {
  assert.equal(getNextTranslationSheetVisibility(false, false, 'toggleChip'), false);
  assert.equal(getNextTranslationSheetVisibility(true, false, 'toggleChip'), false);
});

test('closes the translation sheet after selection or manual dismissal', () => {
  assert.equal(getNextTranslationSheetVisibility(true, true, 'selectTranslation'), false);
  assert.equal(getNextTranslationSheetVisibility(true, true, 'dismiss'), false);
});

test('returns playlist navigation targets for a chapter in sequence', () => {
  const playlist = [
    { bookId: 'GEN', chapter: 1 },
    { bookId: 'GEN', chapter: 3 },
    { bookId: 'LUK', chapter: 2 },
  ];

  const targets = getPlaylistNavigationTargets(playlist, 'GEN', 3);
  assert.equal(targets.hasPlaylistContext, true);
  assert.deepEqual(targets.previousTarget, { bookId: 'GEN', chapter: 1 });
  assert.deepEqual(targets.nextTarget, { bookId: 'LUK', chapter: 2 });
});

test('returns no next target at the end of a playlist', () => {
  const playlist = [
    { bookId: 'GEN', chapter: 1 },
    { bookId: 'LUK', chapter: 2 },
  ];

  const targets = getPlaylistNavigationTargets(playlist, 'LUK', 2);
  assert.equal(targets.hasPlaylistContext, true);
  assert.deepEqual(targets.previousTarget, { bookId: 'GEN', chapter: 1 });
  assert.equal(targets.nextTarget, null);
});

test('falls back when playlist context is missing or invalid', () => {
  assert.deepEqual(getPlaylistNavigationTargets(null, 'GEN', 1), {
    hasPlaylistContext: false,
    previousTarget: null,
    nextTarget: null,
  });

  const playlist = [{ bookId: 'GEN', chapter: 1 }];
  assert.deepEqual(getPlaylistNavigationTargets(playlist, 'EXO', 1), {
    hasPlaylistContext: false,
    previousTarget: null,
    nextTarget: null,
  });
});
