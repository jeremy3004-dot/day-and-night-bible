import test from 'node:test';
import assert from 'node:assert/strict';
import { getJourneyInitialStepIndex, getJourneyNextStepIndex, getJourneySwipeDirection } from './journeyModel';

test('journey swipe direction treats left swipes as next and right swipes as previous', () => {
  assert.equal(getJourneySwipeDirection(-60, 0), 1);
  assert.equal(getJourneySwipeDirection(60, 0), -1);
  assert.equal(getJourneySwipeDirection(0, -700), 1);
  assert.equal(getJourneySwipeDirection(0, 700), -1);
  assert.equal(getJourneySwipeDirection(10, 10), null);
});

test('journey step helpers clamp indices safely', () => {
  assert.equal(getJourneyNextStepIndex(0, -1, 4), 0);
  assert.equal(getJourneyNextStepIndex(0, 1, 4), 1);
  assert.equal(getJourneyNextStepIndex(3, 1, 4), 3);
  assert.equal(getJourneyInitialStepIndex({ steps: [] } as never, 3), 0);
});
