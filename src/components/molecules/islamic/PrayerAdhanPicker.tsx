import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {ADHAN_AUDIO_OPTIONS, type AdhanAudioOption} from '@constants/adhanAudio';
import {playAdhan, stopAdhan} from '@services/islamicServices/adhanAudioService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Lets the user preview and pick which Adhan plays for prayer reminders.
 */
const PrayerAdhanPicker = ({selectedId, onSelect}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const {sizes} = useThemeTokens();
  const isAr = i18n.language.startsWith('ar');
  const [expanded, setExpanded] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const styles = useThemedStyles(tokens => ({
    card: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      marginBottom: tokens.spacing.md,
      ...tokens.shadows.sm,
    },
    headerRow: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
    },
    list: {
      maxHeight: tokens.sizes.touchTarget * 8,
      marginTop: tokens.spacing.sm,
    },
    option: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      paddingVertical: tokens.spacing.sm,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
      gap: tokens.spacing.sm,
    },
    optionActive: {
      backgroundColor: tokens.colors.prayerActiveMuted,
    },
    optionText: {flex: tokens.layout.flex.fill},
    actions: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      alignItems: 'center' as const,
    },
  }));

  const selected =
    ADHAN_AUDIO_OPTIONS.find(item => item.id === selectedId) ?? ADHAN_AUDIO_OPTIONS[0];

  const labelFor = (item: AdhanAudioOption) => (isAr ? item.nameAr : item.nameEn);
  const subFor = (item: AdhanAudioOption) => (isAr ? item.reciterAr : item.reciterEn);

  const handlePreview = (item: AdhanAudioOption) => {
    if (previewId === item.id) {
      stopAdhan();
      setPreviewId(null);
      return;
    }
    playAdhan(item.url);
    setPreviewId(item.id);
  };

  const handleSelect = (item: AdhanAudioOption) => {
    onSelect(item.id);
    stopAdhan();
    setPreviewId(null);
  };

  useEffect(
    () => () => {
      stopAdhan();
    },
    [],
  );

  return (
    <View style={styles.card}>
      <Pressable style={styles.headerRow} onPress={() => setExpanded(current => !current)}>
        <View style={styles.optionText}>
          <Heading text={t('islamic.prayer.adhanSoundTitle')} level="h3" />
          <Spacer size="xxs" />
          <TextView text={t('islamic.prayer.adhanSoundBody')} variant="caption" muted />
          <Spacer size="xxs" />
          <TextView
            text={`${labelFor(selected)} · ${subFor(selected)}`}
            variant="bodySmall"
          />
        </View>
        <TouchableIcon
          iconType="Ionicons"
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={sizes.iconSm}
          onPress={() => setExpanded(current => !current)}
        />
      </Pressable>

      {expanded ? (
        <ScrollView style={styles.list} nestedScrollEnabled>
          {ADHAN_AUDIO_OPTIONS.map(item => {
            const active = item.id === selectedId;
            const previewing = item.id === previewId;
            return (
              <Pressable
                key={item.id}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => handleSelect(item)}>
                <View style={styles.optionText}>
                  <TextView text={labelFor(item)} variant="body" />
                  <TextView text={subFor(item)} variant="caption" muted />
                </View>
                <View style={styles.actions}>
                  <TouchableIcon
                    iconType="Ionicons"
                    name={previewing ? 'stop-circle-outline' : 'play-circle-outline'}
                    size={sizes.iconMd}
                    onPress={() => handlePreview(item)}
                  />
                  {active ? (
                    <TouchableIcon
                      iconType="Ionicons"
                      name="checkmark-circle"
                      size={sizes.iconSm}
                      onPress={() => handleSelect(item)}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default PrayerAdhanPicker;
