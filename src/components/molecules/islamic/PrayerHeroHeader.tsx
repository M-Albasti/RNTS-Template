import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextView from '@atoms/TextView';

import PrayerSunPath from '@molecules/islamic/PrayerSunPath';
import type {PrayerTimeKey} from '@Types/islamicTypes';
import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  locationLabel: string;
  currentClock: string;
  nextPrayerKey: PrayerTimeKey | null;
  countdownLabel: string;
  dayProgress: number;
  onPressLocation: () => void;
};

/**
 * Sky-style hero: location, live clock, next prayer countdown, sun path.
 */
const PrayerHeroHeader = ({
  locationLabel,
  currentClock,
  nextPrayerKey,
  countdownLabel,
  dayProgress,
  onPressLocation,
}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.prayerHero,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.lg,
      overflow: 'hidden' as const,
      ...tokens.shadows.md,
    },
    onHero: {color: tokens.colors.prayerOnHero},
    locationChip: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.prayerHeroMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginBottom: tokens.spacing.sm,
    },
    title: {
      color: tokens.colors.prayerOnHero,
      fontSize: tokens.typography.h1.fontSize,
      fontWeight: tokens.typography.h1.fontWeight,
    },
    clockRow: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      marginTop: tokens.spacing.xs,
    },
    pill: {
      alignSelf: 'flex-start' as const,
      marginTop: tokens.spacing.sm,
      backgroundColor: tokens.colors.prayerHeroMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.prayerAccent,
    },
    accent: {color: tokens.colors.prayerAccent},
  }));

  return (
    <View style={styles.hero}>
      <Pressable style={styles.locationChip} onPress={onPressLocation}>
        <TextView text={locationLabel} variant="caption" style={styles.onHero} />
      </Pressable>

      <TextView
        text={
          nextPrayerKey
            ? t(`islamic.prayer.${nextPrayerKey}`)
            : t('islamic.prayer.nextPrayer')
        }
        style={styles.title}
      />

      <View style={styles.clockRow}>
        <TextView
          text={`${t('islamic.prayer.currentTime')}: ${currentClock}`}
          variant="bodySmall"
          style={styles.onHero}
        />
      </View>

      {countdownLabel ? (
        <View style={styles.pill}>
          <TextView text={countdownLabel} variant="caption" style={styles.accent} />
        </View>
      ) : null}

      <PrayerSunPath dayProgress={dayProgress} />
    </View>
  );
};

export default PrayerHeroHeader;
