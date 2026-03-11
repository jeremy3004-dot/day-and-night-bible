import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getJourneyProgressPercent,
  resolveHomeMomentumMetric,
  resolveHomePrimaryAction,
} from './homeExperienceModel';

test('home primary action prioritizes the next lesson when the user has not read yet today', () => {
  assert.equal(
    resolveHomePrimaryAction({
      chaptersToday: 0,
      hasNextLesson: true,
      canPlayDailyAudio: true,
    }),
    'continue-journey'
  );
});

test('home primary action falls back to daily audio when there is no lesson to resume', () => {
  assert.equal(
    resolveHomePrimaryAction({
      chaptersToday: 0,
      hasNextLesson: false,
      canPlayDailyAudio: true,
    }),
    'play-daily-audio'
  );
});

test('home primary action defaults to continue reading once today already has momentum', () => {
  assert.equal(
    resolveHomePrimaryAction({
      chaptersToday: 2,
      hasNextLesson: true,
      canPlayDailyAudio: true,
    }),
    'continue-reading'
  );
});

test('momentum metric prefers streaks, then week progress, then journey progress', () => {
  assert.equal(
    resolveHomeMomentumMetric({
      streakDays: 6,
      weekCount: 3,
      completedLessons: 4,
    }),
    'streak'
  );

  assert.equal(
    resolveHomeMomentumMetric({
      streakDays: 0,
      weekCount: 3,
      completedLessons: 4,
    }),
    'week'
  );

  assert.equal(
    resolveHomeMomentumMetric({
      streakDays: 0,
      weekCount: 0,
      completedLessons: 4,
    }),
    'journey'
  );
});

test('journey progress percent clamps into the expected range', () => {
  assert.equal(getJourneyProgressPercent(5, 10), 50);
  assert.equal(getJourneyProgressPercent(0, 0), 0);
  assert.equal(getJourneyProgressPercent(20, 10), 100);
});
