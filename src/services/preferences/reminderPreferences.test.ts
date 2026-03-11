import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_REMINDER_PICKER_STATE,
  getReminderEnablePlan,
  getReminderPickerState,
  parseReminderTime,
} from './reminderPreferences';

test('parses a valid reminder time string into hour and minute numbers', () => {
  assert.deepEqual(parseReminderTime('06:15'), {
    hour: 6,
    minute: 15,
  });
});

test('rejects reminder times that are not strict HH:mm values', () => {
  assert.equal(parseReminderTime('6:15'), null);
  assert.equal(parseReminderTime('24:00'), null);
  assert.equal(parseReminderTime('hello'), null);
});

test('seeds the picker from a stored reminder time when the minute is supported', () => {
  assert.deepEqual(getReminderPickerState('18:45'), {
    hour: 18,
    minute: '45',
  });
});

test('keeps the stored hour but falls back to the default picker minute when needed', () => {
  assert.deepEqual(getReminderPickerState('05:07'), {
    hour: 5,
    minute: DEFAULT_REMINDER_PICKER_STATE.minute,
  });
});

test('enabling reminders schedules the existing stored time when one is available', () => {
  assert.deepEqual(getReminderEnablePlan('08:30'), {
    type: 'schedule-existing',
    schedule: {
      hour: 8,
      minute: 30,
    },
  });
});

test('enabling reminders prompts for a time when none has been saved yet', () => {
  assert.deepEqual(getReminderEnablePlan(null), {
    type: 'open-picker',
  });
});
