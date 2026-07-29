// Notification permissions, Android channel, and scheduling. The pure "what to
// schedule" decision lives in dates.ts (buildTriggerSpecs); this module maps
// those specs onto expo trigger inputs and talks to the native module.

import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import type { Habit } from './types';
import { buildTriggerSpecs, formatTime } from './dates';

export const ANDROID_CHANNEL_ID = 'habit-reminders';

/**
 * Expo Go on Android dropped local notifications in SDK 53. When that's the
 * runtime we must not pretend a reminder was scheduled — the UI disables the
 * switch and explains why.
 */
export const notificationsAvailable: boolean = !(
  Platform.OS === 'android' &&
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient
);

// Foreground presentation. SDK 57 uses shouldShowBanner / shouldShowList;
// shouldShowAlert is deprecated.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Recordatorios',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#7C5CFF',
  });
}

/** Ask for permission (idempotent). Returns whether it is granted. */
export async function requestPermissions(): Promise<boolean> {
  if (!notificationsAvailable) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (current.canAskAgain === false) return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

function specToTrigger(
  spec: ReturnType<typeof buildTriggerSpecs>[number],
): Notifications.NotificationTriggerInput {
  const channelId =
    Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined;
  if (spec.kind === 'daily') {
    return {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: spec.hour,
      minute: spec.minute,
      channelId,
    };
  }
  return {
    type: SchedulableTriggerInputTypes.WEEKLY,
    weekday: spec.weekday,
    hour: spec.hour,
    minute: spec.minute,
    channelId,
  };
}

/**
 * Schedule all reminders for a habit and return the created notification ids.
 * Returns [] when notifications are unavailable or the reminder is off.
 */
export async function scheduleHabit(habit: Habit): Promise<string[]> {
  if (!notificationsAvailable || !habit.reminderEnabled) return [];
  await ensureAndroidChannel();
  const specs = buildTriggerSpecs(habit);
  const ids: string[] = [];
  for (const spec of specs) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: habit.name,
        body: `Es hora de: ${habit.name} (${formatTime({
          hour: spec.hour,
          minute: spec.minute,
        })})`,
        data: { habitId: habit.id },
      },
      trigger: specToTrigger(spec),
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelHabit(habit: Habit): Promise<void> {
  for (const id of habit.notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // Already gone; ignore.
    }
  }
}

/**
 * Cancel everything and reprogram from the stored habits, so the OS always
 * matches persisted state after a restart, reinstall, or timezone change.
 * Returns a map habitId -> new notification ids.
 */
export async function resyncReminders(
  habits: Habit[],
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  if (!notificationsAvailable) {
    for (const h of habits) result[h.id] = [];
    return result;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  await ensureAndroidChannel();
  for (const h of habits) {
    result[h.id] = await scheduleHabit(h);
  }
  return result;
}
