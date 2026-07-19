import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {isSameLocalDay} from '@helpers/prayerScheduleHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  day: Date;
  gregorianLabel: string;
  hijriLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

const PrayerDateSwitcher = ({
  day,
  gregorianLabel,
  hijriLabel,
  onPrevious,
  onNext,
}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {sizes} = useThemeTokens();
  const isToday = isSameLocalDay(day, new Date());

  const styles = useThemedStyles(tokens => ({
    wrap: {
      alignItems: 'center' as const,
      marginVertical: tokens.spacing.md,
      gap: tokens.spacing.xs,
    },
    row: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      width: '100%' as const,
      paddingHorizontal: tokens.spacing.sm,
    },
    center: {
      flex: tokens.layout.flex.fill,
      alignItems: 'center' as const,
    },
    todayBadge: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.prayerAccent,
      borderRadius: tokens.radius.sm,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      backgroundColor: tokens.colors.surface,
    },
    hijri: {
      color: tokens.colors.prayerAccent,
    },
  }));

  return (
    <View style={styles.wrap}>
      {isToday ? (
        <View style={styles.todayBadge}>
          <TextView text={t('islamic.prayer.today')} variant="caption" />
        </View>
      ) : null}
      <View style={styles.row}>
        <TouchableIcon
          iconType="Ionicons"
          name="chevron-back"
          size={sizes.iconSm}
          onPress={onPrevious}
        />
        <View style={styles.center}>
          <TextView text={gregorianLabel} variant="body" />
          <TextView text={hijriLabel} variant="caption" style={styles.hijri} />
        </View>
        <TouchableIcon
          iconType="Ionicons"
          name="chevron-forward"
          size={sizes.iconSm}
          onPress={onNext}
        />
      </View>
    </View>
  );
};

export default PrayerDateSwitcher;
