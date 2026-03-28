import test from 'node:test';
import assert from 'node:assert/strict';
import { prayerJourney, prayerJourneys } from './prayerJourneys';

test('prayer journey seeds a four-step devotional path', () => {
  assert.equal(prayerJourneys.length, 1);
  assert.equal(prayerJourney.id, 'prayer-journey');
  assert.equal(prayerJourney.kind, 'prayer');
  assert.equal(prayerJourney.steps.length, 4);
  assert.deepEqual(prayerJourney.steps.map((step) => step.id), ['open', 'ask', 'trust', 'rest']);
});
