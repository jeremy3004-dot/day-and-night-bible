import test from 'node:test';
import assert from 'node:assert/strict';
import { meditationJourney, meditationJourneys } from './meditationJourneys';

test('meditation journey seeds a four-step scripture-first experience', () => {
  assert.equal(meditationJourneys.length, 1);
  assert.equal(meditationJourney.id, 'meditation-journey');
  assert.equal(meditationJourney.kind, 'meditate');
  assert.equal(meditationJourney.steps.length, 4);
  assert.deepEqual(
    meditationJourney.steps.map((step) => step.id),
    ['settle', 'listen', 'receive', 'rest']
  );
});
