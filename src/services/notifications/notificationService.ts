import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import i18n from '../../i18n';

/**
 * Register the foreground notification handler so banners are shown instead
 * of being silently dropped while the app is in the foreground.
 *
 * Must be called at module scope (before any component renders) in App.tsx.
 */
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Create Android notification channels required for scheduled notifications.
 * Channels are idempotent — safe to call on every app launch.
 * No-ops on iOS.
 */
export async function setupAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('daily-reminder', {
    name: i18n.t('notifications.channelDailyReminder'),
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  });

  await Notifications.setNotificationChannelAsync('group-alerts', {
    name: i18n.t('notifications.channelGroupAlerts'),
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

/**
 * Request notification permissions.
 * Returns true if permissions are already granted or the user grants them.
 * Returns false if the user denies or has previously denied permissions.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule a daily reading reminder at the given hour and minute.
 *
 * Uses the stable identifier 'daily-reading-reminder' so repeated calls
 * replace the existing schedule rather than accumulating duplicate notifications.
 */
export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  // Cancel the existing scheduled notification first (if any).
  // Use catch() so that a missing notification does not throw.
  await Notifications.cancelScheduledNotificationAsync('daily-reading-reminder').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reading-reminder',
    content: {
      title: i18n.t('settings.notificationTitle'),
      body: i18n.t('settings.notificationBody'),
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: 'daily-reminder',
    },
  });
}

/**
 * Cancel the daily reading reminder.
 *
 * Cancels only the 'daily-reading-reminder' identifier — does NOT cancel all
 * scheduled notifications. This preserves any other app notifications (e.g.
 * group session alerts) that the user may have enabled.
 */
export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('daily-reading-reminder').catch(() => {});
}
