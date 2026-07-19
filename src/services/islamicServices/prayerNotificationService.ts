import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Platform} from 'react-native';

import {prayerClient} from '@api/clients/prayerClient';
import {resolveAdhanAudioUrl} from '@constants/adhanAudio';
import {
  addCalendarDays,
  buildPrayerSchedule,
  isPrayerAdhanKey,
  PRAYER_ADHAN_KEYS,
} from '@helpers/prayerScheduleHelpers';
import type {
  PrayerLocation,
  PrayerReminderKey,
  PrayerReminderSettings,
  PrayerTimings,
} from '@Types/islamicTypes';

const CHANNEL_ID = 'prayer-adhan';
const DAYS_AHEAD = 7;

/** Bumps when a newer sync starts so overlapping runs abort cleanly. */
let syncGeneration = 0;

const notificationIdFor = (dayOffset: number, key: PrayerReminderKey) =>
  `prayer-${dayOffset}-${key}`;

const ensureChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Prayer Adhan',
    importance: AndroidImportance.HIGH,
    // Silent channel — Adhan audio is played from JS on notification press.
    sound: undefined,
    vibration: true,
  });
};

const isKeyEnabled = (
  settings: PrayerReminderSettings,
  key: PrayerReminderKey,
): boolean => Boolean(settings.enabledAll || settings.byKey[key]);

const fetchDayTimings = async (
  location: PrayerLocation,
  day: Date,
): Promise<PrayerTimings | null> => {
  try {
    if (
      (location.mode === 'gps' || location.mode === 'timezone') &&
      location.latitude != null &&
      location.longitude != null
    ) {
      return await prayerClient.getTimingsByCoords(
        location.latitude,
        location.longitude,
        4,
        location.timezone ?? undefined,
        day,
      );
    }
    if (location.city && location.country) {
      return await prayerClient.getTimingsByCity(
        location.city,
        location.country,
        4,
        day,
      );
    }
  } catch (error) {
    console.log('prayerNotificationService.fetchDayTimings Error =>', error);
  }
  return null;
};

export const cancelPrayerReminderNotifications = async () => {
  const ids: string[] = [];
  for (let day = 0; day < DAYS_AHEAD; day += 1) {
    for (const key of PRAYER_ADHAN_KEYS) {
      ids.push(notificationIdFor(day, key));
    }
  }
  // Also cancel legacy ids that may have scheduled sunrise/duha/midnight.
  const legacyExtras = ['sunrise', 'duha', 'midnight'] as const;
  for (let day = 0; day < DAYS_AHEAD; day += 1) {
    for (const key of legacyExtras) {
      ids.push(`prayer-${day}-${key}`);
    }
  }
  await Promise.all(ids.map(id => notifee.cancelNotification(id).catch(() => undefined)));
};

type ScheduleArgs = {
  location: PrayerLocation;
  settings: PrayerReminderSettings;
  titleFor: (key: PrayerReminderKey) => string;
  bodyFor: (key: PrayerReminderKey, time: string) => string;
};

/**
 * Schedules prayer-time notifications. Adhan audio plays on notification press
 * (JS path); notifications stay silent so OS sound does not overlap.
 */
export const syncPrayerReminderNotifications = async ({
  location,
  settings,
  titleFor,
  bodyFor,
}: ScheduleArgs): Promise<void> => {
  const generation = ++syncGeneration;
  const isStale = () => generation !== syncGeneration;

  await ensureChannel();
  if (isStale()) {
    return;
  }
  await cancelPrayerReminderNotifications();
  if (isStale()) {
    return;
  }

  const anyEnabled =
    settings.enabledAll || PRAYER_ADHAN_KEYS.some(key => settings.byKey[key]);
  if (!anyEnabled) {
    return;
  }

  const now = Date.now();
  const adhanUrl = resolveAdhanAudioUrl(settings.adhanSoundId);

  for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset += 1) {
    if (isStale()) {
      return;
    }
    const day = addCalendarDays(new Date(), dayOffset);
    const timings = await fetchDayTimings(location, day);
    if (isStale()) {
      return;
    }
    if (!timings) {
      continue;
    }
    const schedule = buildPrayerSchedule(timings, day);
    for (const entry of schedule) {
      if (isStale()) {
        return;
      }
      if (!isPrayerAdhanKey(entry.key) || !isKeyEnabled(settings, entry.key)) {
        continue;
      }
      const triggerAt = entry.at.getTime();
      if (triggerAt <= now + 15_000) {
        continue;
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerAt,
      };

      try {
        await notifee.createTriggerNotification(
          {
            id: notificationIdFor(dayOffset, entry.key),
            title: titleFor(entry.key),
            body: bodyFor(entry.key, entry.time),
            data: {
              kind: 'prayer_adhan',
              prayerKey: entry.key,
              adhanSoundId: settings.adhanSoundId ?? '',
              adhanUrl,
            },
            android: {
              channelId: CHANNEL_ID,
              pressAction: {id: 'default'},
              smallIcon: 'ic_launcher',
              importance: AndroidImportance.HIGH,
              // Silent — Adhan is played from JS on press to avoid double audio.
              sound: '',
            },
            ios: {
              sound: '',
            },
          },
          trigger,
        );
      } catch (error) {
        console.log('prayerNotificationService.schedule Error =>', error);
      }
    }
  }
};
