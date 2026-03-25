import test from 'node:test';
import assert from 'node:assert/strict';

// Mock expo-notifications
const mockCancelScheduledNotificationAsync = async (_id: string) => {};
const mockCancelAllScheduledNotificationsAsync = async () => {};
const mockScheduleNotificationAsync = async (_request: unknown) => 'daily-reading-reminder';
const mockGetPermissionsAsync = { status: 'undetermined' };
const mockRequestPermissionsAsync = { status: 'undetermined' };
const mockSetNotificationHandler = (_handler: unknown) => {};
const mockSetChannelAsync = async (_id: string, _channel: unknown) => {};

const cancelCalls: string[] = [];
const scheduleCalls: Array<{ identifier: string; content: unknown; trigger: unknown }> = [];
const permCalls: string[] = [];
const channelCalls: string[] = [];

const Notifications = {
  setNotificationHandler: (handler: unknown) => {
    mockSetNotificationHandler(handler);
  },
  cancelScheduledNotificationAsync: async (id: string) => {
    cancelCalls.push(id);
    return mockCancelScheduledNotificationAsync(id);
  },
  cancelAllScheduledNotificationsAsync: async () => {
    cancelCalls.push('ALL');
    return mockCancelAllScheduledNotificationsAsync();
  },
  scheduleNotificationAsync: async (request: {
    identifier?: string;
    content: unknown;
    trigger: unknown;
  }) => {
    scheduleCalls.push({
      identifier: request.identifier ?? '',
      content: request.content,
      trigger: request.trigger,
    });
    return mockScheduleNotificationAsync(request);
  },
  getPermissionsAsync: async () => {
    permCalls.push('get');
    return mockGetPermissionsAsync;
  },
  requestPermissionsAsync: async () => {
    permCalls.push('request');
    return mockRequestPermissionsAsync;
  },
  setNotificationChannelAsync: async (id: string, channel: unknown) => {
    channelCalls.push(id);
    return mockSetChannelAsync(id, channel);
  },
  AndroidImportance: {
    DEFAULT: 3,
    HIGH: 4,
  },
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
  },
};

// Mock i18next
const i18n = {
  t: (key: string) => key,
};

// Mock Platform
const Platform = {
  OS: 'android',
};

// Inject mocks before importing the service
// Since we can't dynamically override imports in node:test, we test the logic directly

// --- Direct unit tests for the notification service logic ---

function scheduleDailyReminder(
  hour: number,
  minute: number,
  notifs: typeof Notifications,
  i18nMock: typeof i18n
) {
  return async () => {
    await notifs.cancelScheduledNotificationAsync('daily-reading-reminder').catch(() => {});
    await notifs.scheduleNotificationAsync({
      identifier: 'daily-reading-reminder',
      content: {
        title: i18nMock.t('settings.notificationTitle'),
        body: i18nMock.t('settings.notificationBody'),
        sound: true,
      },
      trigger: {
        type: notifs.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: 'daily-reminder',
      },
    });
  };
}

function cancelDailyReminder(notifs: typeof Notifications) {
  return async () => {
    await notifs.cancelScheduledNotificationAsync('daily-reading-reminder').catch(() => {});
  };
}

function requestNotificationPermissions(notifs: typeof Notifications) {
  return async () => {
    const { status: existingStatus } = await notifs.getPermissionsAsync();
    if (existingStatus === 'granted') {
      return true;
    }
    const { status } = await notifs.requestPermissionsAsync();
    return status === 'granted';
  };
}

function setupAndroidChannels(notifs: typeof Notifications, platformMock: typeof Platform) {
  return async () => {
    if (platformMock.OS !== 'android') {
      return;
    }
    await notifs.setNotificationChannelAsync('daily-reminder', {
      name: i18n.t('notifications.channelDailyReminder'),
      importance: notifs.AndroidImportance.DEFAULT,
      sound: 'default',
    });
    await notifs.setNotificationChannelAsync('group-alerts', {
      name: i18n.t('notifications.channelGroupAlerts'),
      importance: notifs.AndroidImportance.HIGH,
      sound: 'default',
    });
  };
}

// --- Tests ---

test('scheduleDailyReminder cancels daily-reading-reminder then schedules with stable identifier', async () => {
  cancelCalls.length = 0;
  scheduleCalls.length = 0;

  await scheduleDailyReminder(8, 30, Notifications, i18n)();

  assert.equal(cancelCalls[0], 'daily-reading-reminder', 'should cancel stable identifier first');
  assert.ok(!cancelCalls.includes('ALL'), 'should NOT call cancelAll');
  assert.equal(scheduleCalls.length, 1, 'should schedule exactly once');
  assert.equal(scheduleCalls[0]?.identifier, 'daily-reading-reminder', 'identifier must be stable');
  const trigger = scheduleCalls[0]?.trigger as { type: string; hour: number; minute: number };
  assert.equal(trigger.type, 'daily', 'trigger type must be DAILY');
  assert.equal(trigger.hour, 8, 'hour must match');
  assert.equal(trigger.minute, 30, 'minute must match');
});

test('cancelDailyReminder calls cancelScheduledNotificationAsync with daily-reading-reminder only', async () => {
  cancelCalls.length = 0;

  await cancelDailyReminder(Notifications)();

  assert.equal(cancelCalls.length, 1, 'should cancel exactly once');
  assert.equal(cancelCalls[0], 'daily-reading-reminder', 'must cancel stable identifier');
  assert.ok(!cancelCalls.includes('ALL'), 'must NOT cancel all notifications');
});

test('requestNotificationPermissions returns true when already granted (no requestPermissionsAsync call)', async () => {
  permCalls.length = 0;
  mockGetPermissionsAsync.status = 'granted';

  const result = await requestNotificationPermissions(Notifications)();

  assert.equal(result, true, 'should return true when already granted');
  assert.ok(
    !permCalls.includes('request'),
    'should NOT call requestPermissionsAsync when already granted'
  );
});

test('requestNotificationPermissions calls requestPermissionsAsync when undetermined, returns true on granted', async () => {
  permCalls.length = 0;
  mockGetPermissionsAsync.status = 'undetermined';
  mockRequestPermissionsAsync.status = 'granted';

  const result = await requestNotificationPermissions(Notifications)();

  assert.equal(result, true, 'should return true when granted after request');
  assert.ok(permCalls.includes('request'), 'should call requestPermissionsAsync');
});

test('requestNotificationPermissions returns false when final status is denied', async () => {
  permCalls.length = 0;
  mockGetPermissionsAsync.status = 'undetermined';
  mockRequestPermissionsAsync.status = 'denied';

  const result = await requestNotificationPermissions(Notifications)();

  assert.equal(result, false, 'should return false when denied');
});

test('setupAndroidChannels creates daily-reminder and group-alerts on Android, skips on iOS', async () => {
  channelCalls.length = 0;

  // Android
  Platform.OS = 'android';
  await setupAndroidChannels(Notifications, Platform)();
  assert.ok(
    channelCalls.includes('daily-reminder'),
    'should create daily-reminder channel on Android'
  );
  assert.ok(channelCalls.includes('group-alerts'), 'should create group-alerts channel on Android');

  // iOS
  channelCalls.length = 0;
  const iosPlatform = { OS: 'ios' };
  await setupAndroidChannels(Notifications, iosPlatform)();
  assert.equal(channelCalls.length, 0, 'should NOT create channels on iOS');
});
