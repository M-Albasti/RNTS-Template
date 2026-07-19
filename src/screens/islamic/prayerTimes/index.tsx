import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {
  usePrayerTimingsByCoordsQuery,
  usePrayerTimingsQuery,
} from '@api/query/hooks/useIslamicQueries';
import PrayerAdhanPicker from '@molecules/islamic/PrayerAdhanPicker';
import PrayerDateSwitcher from '@molecules/islamic/PrayerDateSwitcher';
import PrayerHeroHeader from '@molecules/islamic/PrayerHeroHeader';
import PrayerRemindersBar from '@molecules/islamic/PrayerRemindersBar';
import PrayerTimeRow from '@molecules/islamic/PrayerTimeRow';
import {
  addCalendarDays,
  buildPrayerSchedule,
  formatClockTime,
  formatCountdownParts,
  getCurrentPrayer,
  getNextPrayer,
  isSameLocalDay,
  PRAYER_SCHEDULE_KEYS,
} from '@helpers/prayerScheduleHelpers';
import {
  isPrayerLocationConfigured,
  resolvePrayerLocation,
} from '@helpers/prayerLocationHelpers';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {
  setAdhanSoundId,
  setPrayerReminderEnabledAll,
  togglePrayerReminder,
} from '@redux/slices/islamicSlice';
import {syncPrayerReminderNotifications} from '@services/islamicServices/prayerNotificationService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PrayerTimeKey} from '@Types/islamicTypes';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'PrayerTimes'>};

const PrayerTimes = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const {sizes} = useThemeTokens();
  const islamic = useAppSelector(state => state.islamic);
  const location = resolvePrayerLocation(islamic);
  const configured = isPrayerLocationConfigured(location);
  const reminders = islamic.prayerReminders;

  const [selectedDay, setSelectedDay] = useState(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [now, setNow] = useState(() => new Date());

  const useCoords =
    configured && location.latitude != null && location.longitude != null;

  const cityQuery = usePrayerTimingsQuery(
    useCoords ? '' : location.city,
    useCoords ? '' : location.country,
    selectedDay,
  );
  const coordsQuery = usePrayerTimingsByCoordsQuery(
    useCoords ? location.latitude : null,
    useCoords ? location.longitude : null,
    location.timezone,
    selectedDay,
  );

  const {data, isLoading, isError, isFetching} = useCoords ? coordsQuery : cityQuery;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!configured) {
      navigation.navigate('PrayerLocationSetup');
    }
  }, [configured, navigation]);

  useEffect(() => {
    if (!configured || !data || !isSameLocalDay(selectedDay, new Date())) {
      return;
    }
    syncPrayerReminderNotifications({
      location,
      settings: reminders,
      titleFor: key => t('islamic.prayer.reminderTitle', {prayer: t(`islamic.prayer.${key}`)}),
      bodyFor: (key, time) =>
        t('islamic.prayer.reminderBody', {
          prayer: t(`islamic.prayer.${key}`),
          time,
        }),
    }).catch(() => undefined);
  }, [configured, data, location, reminders, selectedDay, t]);

  const styles = useThemedStyles(tokens => ({
    setupCard: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.shadows.md,
    },
    qiblaChip: {
      marginBottom: tokens.spacing.md,
      alignSelf: 'stretch' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      ...tokens.shadows.sm,
    },
  }));

  const schedule = useMemo(
    () => (data ? buildPrayerSchedule(data, selectedDay) : []),
    [data, selectedDay],
  );

  const nextPrayer = useMemo(() => {
    if (!data || !isSameLocalDay(selectedDay, now)) {
      return null;
    }
    return getNextPrayer(data, now);
  }, [data, now, selectedDay]);

  const currentPrayer = useMemo(() => {
    if (!data || !isSameLocalDay(selectedDay, now)) {
      return null;
    }
    return getCurrentPrayer(data, now);
  }, [data, now, selectedDay]);

  const countdownLabel = useMemo(() => {
    if (!nextPrayer) {
      return '';
    }
    const {hours, minutes, seconds} = formatCountdownParts(nextPrayer.msRemaining);
    const prayerName = t(`islamic.prayer.${nextPrayer.key}`);
    if (hours > 0) {
      return t('islamic.prayer.countdownUntilLong', {
        hours,
        minutes,
        prayer: prayerName,
      });
    }
    return t('islamic.prayer.countdownUntil', {
      minutes,
      seconds,
      prayer: prayerName,
    });
  }, [nextPrayer, t]);

  const dayProgress = useMemo(() => {
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes / (24 * 60);
  }, [now]);

  const hijriLabel = useMemo(() => {
    if (!data) {
      return '';
    }
    if (i18n.language.startsWith('ar') && data.hijriDateAr) {
      return `${data.hijriDateAr} AH`;
    }
    return `${data.hijriDate} AH`;
  }, [data, i18n.language]);

  const isReminderOn = useCallback(
    (key: PrayerTimeKey) => Boolean(reminders.enabledAll || reminders.byKey[key]),
    [reminders],
  );

  const handleToggleReminder = useCallback(
    (key: PrayerTimeKey) => {
      dispatch(togglePrayerReminder(key));
    },
    [dispatch],
  );

  if (!configured) {
    return (
      <ScreenContainer scroll bottomPadding="xxl">
        <ScreenHeader title={t('islamic.prayer.title')} onBack={() => navigation.goBack()} />
        <View style={styles.setupCard}>
          <Heading text={t('islamic.prayer.needLocationTitle')} level="h3" />
          <Spacer size="xs" />
          <TextView text={t('islamic.prayer.needLocationBody')} variant="bodySmall" muted />
          <Spacer size="md" />
          <Button
            label={t('islamic.prayer.chooseLocation')}
            onPress={() => navigation.navigate('PrayerLocationSetup')}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('islamic.prayer.title')}
        onBack={() => navigation.goBack()}
        rightAccessory={
          <TouchableIcon
            iconType="Ionicons"
            name="compass-outline"
            size={sizes.iconSm}
            onPress={() => navigation.navigate('Qibla')}
          />
        }
      />

      <PrayerHeroHeader
        locationLabel={location.label || `${location.city}, ${location.country}`}
        currentClock={formatClockTime(now)}
        nextPrayerKey={nextPrayer?.key ?? null}
        countdownLabel={countdownLabel}
        dayProgress={dayProgress}
        onPressLocation={() => navigation.navigate('PrayerLocationSetup')}
      />

      <Spacer size="md" />

      <Pressable style={styles.qiblaChip} onPress={() => navigation.navigate('Qibla')}>
        <View>
          <TextView text={t('islamic.prayer.qiblaTitle')} variant="body" />
          <TextView text={t('islamic.prayer.qiblaHint')} variant="caption" muted />
        </View>
        <TouchableIcon
          iconType="Ionicons"
          name="chevron-forward"
          size={sizes.iconSm}
          onPress={() => navigation.navigate('Qibla')}
        />
      </Pressable>

      <PrayerDateSwitcher
        day={selectedDay}
        gregorianLabel={data?.date ?? selectedDay.toDateString()}
        hijriLabel={hijriLabel}
        onPrevious={() => setSelectedDay(current => addCalendarDays(current, -1))}
        onNext={() => setSelectedDay(current => addCalendarDays(current, 1))}
      />

      <PrayerRemindersBar
        enabledAll={reminders.enabledAll}
        onEnableAll={() => dispatch(setPrayerReminderEnabledAll(true))}
        onMuteAll={() => dispatch(setPrayerReminderEnabledAll(false))}
      />

      <PrayerAdhanPicker
        selectedId={reminders.adhanSoundId}
        onSelect={id => dispatch(setAdhanSoundId(id))}
      />

      {isLoading || isFetching ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <>
          {PRAYER_SCHEDULE_KEYS.map(key => {
            const entry = schedule.find(item => item.key === key);
            if (!entry) {
              return null;
            }
            const isActive =
              isSameLocalDay(selectedDay, now) && currentPrayer?.key === key;
            const isPast =
              isSameLocalDay(selectedDay, now) && entry.at.getTime() < now.getTime() && !isActive;
            return (
              <PrayerTimeRow
                key={key}
                prayerKey={key}
                time={entry.time}
                isActive={isActive}
                isPast={isPast}
                reminderOn={isReminderOn(key)}
                onToggleReminder={() => handleToggleReminder(key)}
              />
            );
          })}
        </>
      )}

      <Spacer size="md" />
      <TextView text={t('islamic.prayer.source')} variant="caption" muted />
    </ScreenContainer>
  );
};

export default PrayerTimes;
