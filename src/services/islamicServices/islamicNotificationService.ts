import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Platform} from 'react-native';

import {adhkarClient} from '@api/clients/adhkarClient';
import {hadithClient} from '@api/clients/hadithClient';
import {quranClient} from '@api/clients/quranClient';
import type {
  IslamicNotificationPayload,
  IslamicNotificationSettings,
} from '@Types/islamicTypes';

const CHANNEL_ID = 'islamic-reminders';
/** Random adhkar reminders per day (not fixed hourly slots). */
const RANDOM_PER_DAY = 8;
const DAYS_AHEAD = 2;
const NOTIFICATION_IDS = Array.from(
  {length: DAYS_AHEAD * RANDOM_PER_DAY},
  (_, index) => `islamic-random-adhkar-${index}`,
);

const truncate = (value: string, max = 180) =>
  value.length <= max ? value : `${value.slice(0, max - 1)}…`;

const getTimeBucket = (date: Date = new Date()): 'morning' | 'evening' | 'general' => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return 'morning';
  }
  if (hour >= 15 && hour < 21) {
    return 'evening';
  }
  return 'general';
};

/**
 * Builds a random Islamic reminder — prefers adhkar, then Quran/hadith fallbacks.
 */
export const buildIslamicNotificationPayload = async (
  settings: IslamicNotificationSettings,
  at: Date = new Date(),
): Promise<IslamicNotificationPayload> => {
  const bucket = getTimeBucket(at);
  const options: IslamicNotificationPayload[] = [];

  if (settings.includeAdhkar && bucket === 'morning') {
    try {
      const {items} = await adhkarClient.getMorningAdhkar('ar');
      const item = items[Math.floor(Math.random() * items.length)];
      options.push({
        kind: 'morning_adhkar',
        title: 'ذكر صباحي',
        body: truncate(item.arabicText),
        reference: item.translatedText || 'أذكار الصباح — حصن المسلم',
      });
    } catch {
      // fall through
    }
  }

  if (settings.includeAdhkar && bucket === 'evening') {
    try {
      const {items} = await adhkarClient.getEveningAdhkar('ar');
      const item = items[Math.floor(Math.random() * items.length)];
      options.push({
        kind: 'evening_adhkar',
        title: 'ذكر مسائي',
        body: truncate(item.arabicText),
        reference: item.translatedText || 'أذكار المساء — حصن المسلم',
      });
    } catch {
      // fall through
    }
  }

  if (settings.includeAdhkar) {
    try {
      const dhikr = await adhkarClient.getRandomDhikr('ar');
      options.push({
        kind: 'general_dhikr',
        title: 'ذكر',
        body: truncate(dhikr.arabicText),
        reference: dhikr.translatedText,
      });
    } catch {
      // fall through
    }
  }

  if (settings.includeQuran) {
    try {
      const ayah = await quranClient.getRandomAyah();
      options.push({
        kind: 'quran_ayah',
        title: `آية قرآنية — ${ayah.reference}`,
        body: truncate(ayah.arabic),
        reference: ayah.surahName,
      });
    } catch {
      // fall through
    }
  }

  if (settings.includeHadith) {
    try {
      const hadith = await hadithClient.getRandomHadith('sahih', 'ar');
      options.push({
        kind: 'hadith',
        title: `حديث — ${hadith.editionName}`,
        body: truncate(hadith.text),
        reference: hadith.bookName,
      });
    } catch {
      // fall through
    }
  }

  if (options.length === 0) {
    return {
      kind: 'general_dhikr',
      title: 'تذكير إسلامي',
      body: 'سبحان الله وبحمده، سبحان الله العظيم',
    };
  }

  // Prefer adhkar when available.
  const adhkarOnly = options.filter(
    item =>
      item.kind === 'morning_adhkar' ||
      item.kind === 'evening_adhkar' ||
      item.kind === 'general_dhikr',
  );
  const pool = adhkarOnly.length > 0 ? adhkarOnly : options;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const ensureIslamicNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Islamic reminders',
      importance: AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }
};

export const displayIslamicNotification = async (payload: IslamicNotificationPayload) => {
  await ensureIslamicNotificationChannel();
  await notifee.displayNotification({
    title: payload.title,
    body: payload.body,
    subtitle: payload.reference,
    data: {kind: 'random_adhkar'},
    android: {
      channelId: CHANNEL_ID,
      pressAction: {id: 'default'},
      smallIcon: 'ic_launcher',
    },
    ios: {
      sound: 'default',
    },
  });
};

export const cancelIslamicHourlyNotifications = async () => {
  // Cancel both legacy hourly ids and new random ids.
  const legacy = Array.from({length: 24}, (_, index) => `islamic-hourly-${index}`);
  await Promise.all(
    [...legacy, ...NOTIFICATION_IDS].map(id =>
      notifee.cancelNotification(id).catch(() => undefined),
    ),
  );
};

/**
 * Picks random wall-clock times within waking hours for a given day.
 * Avoids clustering by sorting and spacing ~45+ minutes apart when possible.
 */
const pickRandomTimesForDay = (day: Date, count: number): Date[] => {
  const startHour = 7;
  const endHour = 22;
  const windowMinutes = (endHour - startHour) * 60;
  const candidates: number[] = [];

  for (let i = 0; i < count * 3; i += 1) {
    candidates.push(Math.floor(Math.random() * windowMinutes));
  }
  candidates.sort((a, b) => a - b);

  const picked: number[] = [];
  for (const minute of candidates) {
    if (picked.length >= count) {
      break;
    }
    const last = picked[picked.length - 1];
    if (last == null || minute - last >= 45) {
      picked.push(minute);
    }
  }

  while (picked.length < count) {
    picked.push(Math.floor(Math.random() * windowMinutes));
  }

  return picked
    .slice(0, count)
    .sort((a, b) => a - b)
    .map(offset => {
      const at = new Date(day);
      at.setHours(startHour, 0, 0, 0);
      at.setMinutes(at.getMinutes() + offset);
      return at;
    });
};

/**
 * Schedules random-time notifications with random adhkar (and optional Quran/hadith).
 * Replaces the old fixed hourly schedule.
 */
export const scheduleIslamicHourlyNotifications = async (
  settings: IslamicNotificationSettings,
) => {
  await cancelIslamicHourlyNotifications();

  if (!settings.enabled || !settings.hourlyReminders) {
    return;
  }

  await ensureIslamicNotificationChannel();

  const now = Date.now();
  let idIndex = 0;

  for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset += 1) {
    const day = new Date();
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() + dayOffset);
    const times = pickRandomTimesForDay(day, RANDOM_PER_DAY);

    for (const at of times) {
      if (idIndex >= NOTIFICATION_IDS.length) {
        break;
      }
      if (at.getTime() <= now + 60_000) {
        idIndex += 1;
        continue;
      }

      const payload = await buildIslamicNotificationPayload(settings, at);
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: at.getTime(),
      };

      try {
        await notifee.createTriggerNotification(
          {
            id: NOTIFICATION_IDS[idIndex],
            title: payload.title,
            body: payload.body,
            subtitle: payload.reference,
            data: {
              kind: 'random_adhkar',
              contentKind: payload.kind,
            },
            android: {
              channelId: CHANNEL_ID,
              pressAction: {id: 'default'},
              smallIcon: 'ic_launcher',
            },
            ios: {
              sound: 'default',
            },
          },
          trigger,
        );
      } catch (error) {
        console.log('islamicNotificationService.schedule random Error =>', error);
      }
      idIndex += 1;
    }
  }
};

export const refreshIslamicNotificationSchedule = async (
  settings: IslamicNotificationSettings,
) => {
  if (!settings.enabled) {
    await cancelIslamicHourlyNotifications();
    return;
  }
  await scheduleIslamicHourlyNotifications(settings);
};

export const handleIslamicBackgroundEvent = async () => {
  // Reserved for future background fetch of richer notification content.
};
