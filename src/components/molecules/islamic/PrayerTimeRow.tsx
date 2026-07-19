import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import type {PrayerTimeKey} from '@Types/islamicTypes';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  prayerKey: PrayerTimeKey;
  time: string;
  isActive: boolean;
  isPast: boolean;
  reminderOn: boolean;
  /** Omit for non-Adhan times (sunrise / duha / midnight). */
  onToggleReminder?: () => void;
};

const PrayerTimeRow = ({
  prayerKey,
  time,
  isActive,
  isPast,
  reminderOn,
  onToggleReminder,
}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {sizes} = useThemeTokens();

  const styles = useThemedStyles(tokens => ({
    row: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
      borderWidth: tokens.layout.borderWidth.md,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    rowActive: {
      borderColor: tokens.colors.prayerAccent,
      backgroundColor: tokens.colors.prayerActiveMuted,
    },
    rowPast: {
      opacity: 0.55,
    },
    label: {
      flex: tokens.layout.flex.fill,
    },
    time: {
      marginEnd: tokens.spacing.sm,
    },
  }));

  return (
    <View style={[styles.row, isActive && styles.rowActive, isPast && styles.rowPast]}>
      <TextView
        text={t(`islamic.prayer.${prayerKey}`)}
        variant="body"
        style={styles.label}
      />
      <TextView text={time} variant="body" style={styles.time} />
      {onToggleReminder ? (
        <TouchableIcon
          iconType="Ionicons"
          name={reminderOn ? 'notifications' : 'notifications-off-outline'}
          size={sizes.iconSm}
          onPress={onToggleReminder}
        />
      ) : null}
    </View>
  );
};

export default PrayerTimeRow;
