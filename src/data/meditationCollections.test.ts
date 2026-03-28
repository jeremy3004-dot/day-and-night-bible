import test from 'node:test';
import assert from 'node:assert/strict';
import { meditationCollections } from './meditationCollections';

test('meditation collections surface scripture listening, psalms, gospels, night watch, and memory verses', () => {
  assert.deepEqual(
    meditationCollections.map((collection) => collection.id),
    ['scripture-listening', 'psalms', 'gospels', 'night-watch', 'memory-verses']
  );
  assert.deepEqual(
    meditationCollections.map((collection) => collection.imageKey),
    ['bible', 'window', 'candle', 'candleAlt', 'bible']
  );
});
