import test from 'node:test';
import assert from 'node:assert/strict';
import {
  creationToChristPlaylistId,
  creationToChristPlaylist,
  type CreationToChristPlaylistEntry,
} from './creationToChristPlaylist';

test('exports a typed playlist model with chapter-level entries', () => {
  const typedPlaylist: CreationToChristPlaylistEntry[] = creationToChristPlaylist;
  assert.equal(Array.isArray(typedPlaylist), true);
  assert.equal(typedPlaylist.length > 0, true);
  assert.equal(creationToChristPlaylistId, 'creationToChrist');
});

test('uses chapter-only targets with no verse-level field', () => {
  for (const entry of creationToChristPlaylist) {
    assert.deepEqual(Object.keys(entry).sort(), ['bookId', 'chapter', 'summary', 'title']);
    assert.equal(typeof entry.bookId, 'string');
    assert.equal(Number.isInteger(entry.chapter), true);
    assert.equal(entry.chapter > 0, true);
    assert.equal(entry.title.length > 0, true);
    assert.equal(entry.summary.length > 0, true);
    assert.equal('verse' in entry, false);
  }
});

test('keeps an explicit Creation-to-Christ ordering', () => {
  const orderedReferences = creationToChristPlaylist.map((entry) => `${entry.bookId} ${entry.chapter}`);

  assert.deepEqual(orderedReferences, [
    'GEN 1',
    'GEN 3',
    'GEN 12',
    'GEN 22',
    'EXO 12',
    'EXO 19',
    '2SA 7',
    'ISA 53',
    'LUK 1',
    'LUK 2',
    'LUK 22',
    'LUK 23',
    'LUK 24',
  ]);
});

test('avoids duplicate chapter references', () => {
  const chapterReferences = creationToChristPlaylist.map((entry) => `${entry.bookId}:${entry.chapter}`);
  assert.equal(new Set(chapterReferences).size, chapterReferences.length);
});
