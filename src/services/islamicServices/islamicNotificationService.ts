import notifee, {
  AndroidImportance,
  RepeatFrequency,
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
const NOTIFICATION_IDS = Array.from({length: 24}, (_, index) => `islamic-hourly-${index}`);

const truncate = (value: string, max = 180) =>
  value.length <= max ? value : `${value.slice(0, max - 1)}…`;

const getTimeBucket = (): 'morning' | 'evening' | 'general' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'morning';
  }
  if (hour >= 15 && hour < 21) {
    return 'evening';
  }
  return 'general';
};

export const buildIslamicNotificationPayload = async (
  settings: IslamicNotificationSettings,
): Promise<IslamicNotificationPayload> => {
  const bucket = getTimeBucket();
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
      // fall through to other content types
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

  if (options.length === 0) {
    return {
      kind: 'general_dhikr',
      title: 'تذكير إسلامي',
      body: 'سبحان الله وبحمده، سبحان الله العظيم',
    };
  }

  return options[Math.floor(Math.random() * options.length)];
};

export const ensureIslamicNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Islamic reminders',
      importance: AndroidImportance.HIGH,
    });
  }
};

export const displayIslamicNotification = async (payload: IslamicNotificationPayload) => {
  await ensureIslamicNotificationChannel();
  await notifee.displayNotification({
    title: payload.title,
    body: payload.body,
    subtitle: payload.reference,
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
  await notifee.cancelTriggerNotifications(NOTIFICATION_IDS);
};

export const scheduleIslamicHourlyNotifications = async (
  settings: IslamicNotificationSettings,
) => {
  await cancelIslamicHourlyNotifications();

  if (!settings.enabled || !settings.hourlyReminders) {
    return;
  }

  await ensureIslamicNotificationChannel();

  const now = Date.now();
  for (let hourOffset = 1; hourOffset <= 24; hourOffset += 1) {
    const triggerAt = now + hourOffset * 60 * 60 * 1000;
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerAt,
      repeatFrequency: RepeatFrequency.HOURLY,
    };

    await notifee.createTriggerNotification(
      {
        id: NOTIFICATION_IDS[hourOffset - 1],
        title: 'Islamic reminder',
        body: 'Tap to refresh your daily adhkar and Quranic reflection.',
        android: {
          channelId: CHANNEL_ID,
          pressAction: {id: 'default'},
          smallIcon: 'ic_launcher',
        },
      },
      trigger,
    );
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
