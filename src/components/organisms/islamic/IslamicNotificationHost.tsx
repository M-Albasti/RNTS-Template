import React, {useCallback, useEffect} from 'react';
import {AppState} from 'react-native';
import {useTranslation} from 'react-i18next';

import {PRAYER_ADHAN_KEYS} from '@helpers/prayerScheduleHelpers';
import {
  isPrayerLocationConfigured,
  resolvePrayerLocation,
} from '@helpers/prayerLocationHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {refreshIslamicNotificationSchedule} from '@services/islamicServices/islamicNotificationService';
import {syncPrayerReminderNotifications} from '@services/islamicServices/prayerNotificationService';

/**
 * Keeps finite-horizon Islamic + prayer notification schedules fresh on mount,
 * settings changes, and when the app returns to the foreground.
 */
const IslamicNotificationHost = (): null => {
  const {t} = useTranslation();
  const notificationSettings = useAppSelector(
    state => state.islamic.notificationSettings,
  );
  const prayerReminders = useAppSelector(state => state.islamic.prayerReminders);
  const islamic = useAppSelector(state => state.islamic);
  const location = resolvePrayerLocation(islamic);

  const refreshSchedules = useCallback(() => {
    refreshIslamicNotificationSchedule(notificationSettings).catch(() => undefined);

    const anyPrayerEnabled =
      prayerReminders.enabledAll ||
      PRAYER_ADHAN_KEYS.some(key => prayerReminders.byKey[key]);
    if (!anyPrayerEnabled || !isPrayerLocationConfigured(location)) {
      return;
    }
    syncPrayerReminderNotifications({
      location,
      settings: prayerReminders,
      titleFor: key =>
        t('islamic.prayer.reminderTitle', {prayer: t(`islamic.prayer.${key}`)}),
      bodyFor: (key, time) =>
        t('islamic.prayer.reminderBody', {
          prayer: t(`islamic.prayer.${key}`),
          time,
        }),
    }).catch(() => undefined);
  }, [location, notificationSettings, prayerReminders, t]);

  useEffect(() => {
    refreshSchedules();
  }, [refreshSchedules]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        refreshSchedules();
      }
    });
    return () => sub.remove();
  }, [refreshSchedules]);

  return null;
};

export default IslamicNotificationHost;
