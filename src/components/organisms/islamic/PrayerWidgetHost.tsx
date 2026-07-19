import React, {useEffect, useMemo, useState} from 'react';
import {AppState} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  usePrayerTimingsByCoordsQuery,
  usePrayerTimingsQuery,
} from '@api/query/hooks/useIslamicQueries';
import {
  formatCountdownParts,
  getNextPrayer,
  isPrayerAdhanKey,
} from '@helpers/prayerScheduleHelpers';
import {
  isPrayerLocationConfigured,
  resolvePrayerLocation,
} from '@helpers/prayerLocationHelpers';
import {openPrayerTimes} from '@helpers/islamicDeepLinkNavigation';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {togglePrayerReminder} from '@redux/slices/islamicSlice';
import {
  bindPrayerWidgetActions,
  registerPrayerWidgetBridge,
  syncPrayerHomeWidget,
} from '@services/islamicServices/prayerWidgetBridge';
import type {PrayerReminderKey} from '@Types/islamicTypes';

const formatCountdown = (ms: number): string => {
  const {hours, minutes, seconds} = formatCountdownParts(ms);
  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
};

/**
 * Keeps the Prayer Times home-screen widget in sync and handles its actions.
 * Reminder toggles go through Redux; IslamicNotificationHost reschedules Notifee.
 */
const PrayerWidgetHost = (): null => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const islamic = useAppSelector(state => state.islamic);
  const location = resolvePrayerLocation(islamic);
  const reminders = islamic.prayerReminders;
  const configured = isPrayerLocationConfigured(location);
  const [now, setNow] = useState(() => new Date());

  const useCoords =
    configured && location.latitude != null && location.longitude != null;

  const cityQuery = usePrayerTimingsQuery(
    useCoords ? '' : location.city,
    useCoords ? '' : location.country,
  );
  const coordsQuery = usePrayerTimingsByCoordsQuery(
    useCoords ? location.latitude : null,
    useCoords ? location.longitude : null,
    location.timezone,
  );
  const {data} = useCoords ? coordsQuery : cityQuery;

  const locationLabel = useMemo(() => {
    if (location.label?.trim()) {
      return location.label.trim();
    }
    const city = location.city?.trim() ?? '';
    const country = location.country?.trim() ?? '';
    if (city && country) {
      return `${city}, ${country}`;
    }
    return city || t('islamic.prayer.setLocation', {defaultValue: 'Set your location'});
  }, [location.city, location.country, location.label, t]);

  const timezoneLabel =
    location.timezone ||
    location.timezoneId ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    '';

  useEffect(() => registerPrayerWidgetBridge(), []);

  useEffect(() => {
    bindPrayerWidgetActions({
      onOpenPrayers: () => openPrayerTimes(),
      onToggleReminder: (key?: PrayerReminderKey) => {
        const next = data ? getNextPrayer(data, new Date()) : null;
        const target =
          key && isPrayerAdhanKey(key)
            ? key
            : next && isPrayerAdhanKey(next.key)
              ? next.key
              : null;
        if (target) {
          dispatch(togglePrayerReminder(target));
        }
      },
    });
  }, [data, dispatch]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        setNow(new Date());
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!data) {
      syncPrayerHomeWidget({
        locationLabel,
        timezone: timezoneLabel,
        nextPrayerKey: '',
        nextPrayerName: t('islamic.prayer.nextPrayer', {defaultValue: 'Next prayer'}),
        nextPrayerTime: '--:--',
        countdown: '--:--:--',
        fajr: '--',
        dhuhr: '--',
        asr: '--',
        maghrib: '--',
        isha: '--',
        reminderEnabled: false,
      });
      return;
    }

    const next = getNextPrayer(data, now);
    const nextKey = next?.key;
    const reminderEnabled = Boolean(
      nextKey &&
        isPrayerAdhanKey(nextKey) &&
        (reminders.enabledAll || reminders.byKey[nextKey]),
    );

    syncPrayerHomeWidget({
      locationLabel,
      timezone: timezoneLabel,
      nextPrayerKey: nextKey ?? '',
      nextPrayerName: nextKey
        ? t(`islamic.prayer.${nextKey}`)
        : t('islamic.prayer.nextPrayer', {defaultValue: 'Next prayer'}),
      nextPrayerTime: next?.time ?? '--:--',
      countdown: next ? formatCountdown(next.msRemaining) : '--:--:--',
      fajr: data.fajr,
      dhuhr: data.dhuhr,
      asr: data.asr,
      maghrib: data.maghrib,
      isha: data.isha,
      reminderEnabled,
    });
  }, [data, locationLabel, now, reminders, t, timezoneLabel]);

  return null;
};

export default PrayerWidgetHost;
