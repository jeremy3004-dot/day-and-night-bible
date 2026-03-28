import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getJourneyAmbientChoices,
  getJourneyAmbientOptions,
  getJourneyDefaultAmbient,
} from './journeyAudioService';

test('meditate journeys expose the expected bundled ambient choices', () => {
  assert.deepEqual(getJourneyAmbientChoices('meditate'), ['ambient', 'ocean-waves', 'soft-guitar', 'piano']);
  assert.equal(getJourneyDefaultAmbient('meditate'), 'ocean-waves');
  assert.deepEqual(
    getJourneyAmbientOptions('meditate').map((option) => option.id),
    ['ambient', 'piano', 'soft-guitar', 'ocean-waves']
  );
});

test('prayer journeys expose a distinct bundled ambient set', () => {
  assert.deepEqual(getJourneyAmbientChoices('prayer'), ['ambient', 'piano', 'soft-guitar', 'sitar']);
  assert.equal(getJourneyDefaultAmbient('prayer'), 'piano');
  assert.deepEqual(
    getJourneyAmbientOptions('prayer').map((option) => option.id),
    ['ambient', 'piano', 'soft-guitar', 'sitar']
  );
});
