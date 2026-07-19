import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  enabledAll: boolean;
  onEnableAll: () => void;
  onMuteAll: () => void;
};

const PrayerRemindersBar = ({
  enabledAll,
  onEnableAll,
  onMuteAll,
}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    row: {
      ...tokens.layout.presets.rowBetween,
      gap: tokens.spacing.sm,
      marginBottom: tokens.spacing.md,
    },
    chip: {
      flex: tokens.layout.flex.fill,
      alignItems: 'center' as const,
      borderRadius: tokens.radius.full,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
    },
    chipActive: {
      backgroundColor: tokens.colors.prayerActiveMuted,
      borderColor: tokens.colors.prayerAccent,
    },
  }));

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.chip, enabledAll && styles.chipActive]}
        onPress={onEnableAll}>
        <TextView text={t('islamic.prayer.enableAllReminders')} variant="caption" />
      </Pressable>
      <Pressable style={styles.chip} onPress={onMuteAll}>
        <TextView text={t('islamic.prayer.muteAllReminders')} variant="caption" />
      </Pressable>
    </View>
  );
};

export default PrayerRemindersBar;
