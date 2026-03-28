import test from 'node:test';
import assert from 'node:assert/strict';
import { prayerCollections } from './prayerCollections';

test('prayer collections include free prayer first and the requested heritage categories', () => {
  assert.deepEqual(
    prayerCollections.map((collection) => collection.id),
    [
      'free-prayer',
      'biblical-prayers',
      'jesus-prayers',
      'apostolic-prayers',
      'biblical-figures',
      'martyrs',
      'missionaries',
      'puritans',
      'catholics',
      'mystics',
      'heroes-of-the-faith',
    ]
  );
  assert.deepEqual(
    prayerCollections.map((collection) => collection.imageKey),
    [
      'freePrayer',
      'biblicalPrayers',
      'jesusPrayers',
      'apostolicPrayers',
      'biblicalFigures',
      'martyrs',
      'missionaries',
      'puritans',
      'catholics',
      'mystics',
      'heroesOfTheFaith',
    ]
  );
});
