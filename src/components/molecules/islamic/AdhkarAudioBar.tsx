import React from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import type {AdhkarReciter} from '@constants/adhkarReciters';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  title: string;
  activeIndex: number;
  totalCount: number;
  isPlaying: boolean;
  isLoading?: boolean;
  isContinuous?: boolean;
  reciterId: string;
  reciters: AdhkarReciter[];
  onSelectReciter: (reciterId: string) => void;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

/** Bottom controls for adhkar audio with reciter chips. */
const AdhkarAudioBar = ({
  title,
  activeIndex,
  totalCount,
  isPlaying,
  isLoading,
  isContinuous,
  reciterId,
  reciters,
  onSelectReciter,
  onTogglePlay,
  onPrevious,
  onNext,
}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const {sizes} = useThemeTokens();
  const isAr = i18n.language.startsWith('ar');
  const activeReciter = reciters.find(item => item.id === reciterId) ?? reciters[0];

  const styles = useThemedStyles(tokens => ({
    wrap: {
      borderTopWidth: tokens.layout.borderWidth.sm,
      borderTopColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.md,
      ...tokens.shadows.lg,
    },
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    controls: {...tokens.layout.presets.row, gap: tokens.spacing.md, alignItems: 'center' as const},
    badge: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginTop: tokens.spacing.xxs,
    },
    chips: {marginTop: tokens.spacing.sm},
    chipRow: {...tokens.layout.presets.row, gap: tokens.spacing.xs},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      backgroundColor: tokens.colors.background,
    },
    chipActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    chipTextActive: {color: tokens.colors.textInverse},
  }));

  const progressLabel = isContinuous
    ? t('islamic.adhkar.continuousTrack')
    : t('islamic.adhkar.progress', {
        current: Math.min(activeIndex + 1, Math.max(totalCount, 1)),
        total: Math.max(totalCount, 1),
      });

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <Heading
            text={
              activeReciter
                ? isAr
                  ? activeReciter.nameAr
                  : activeReciter.nameEn
                : title
            }
            level="h3"
          />
          <View style={styles.badge}>
            <TextView text={progressLabel} variant="caption" />
          </View>
        </View>
        <View style={styles.controls}>
          {!isContinuous ? (
            <TouchableIcon
              iconType="Ionicons"
              name="play-skip-back"
              size={sizes.iconSm}
              onPress={onPrevious}
            />
          ) : null}
          <TouchableIcon
            iconType="Ionicons"
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={sizes.iconLg ?? sizes.iconMd}
            onPress={onTogglePlay}
          />
          {!isContinuous ? (
            <TouchableIcon
              iconType="Ionicons"
              name="play-skip-forward"
              size={sizes.iconSm}
              onPress={onNext}
            />
          ) : null}
        </View>
      </View>
      {reciters.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chips}
          contentContainerStyle={styles.chipRow}>
          {reciters.map(item => (
            <Pressable
              key={item.id}
              style={[styles.chip, reciterId === item.id && styles.chipActive]}
              onPress={() => onSelectReciter(item.id)}>
              <TextView
                text={isAr ? item.nameAr : item.nameEn}
                variant="caption"
                style={reciterId === item.id ? styles.chipTextActive : undefined}
              />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      {isLoading ? (
        <>
          <Spacer size="xs" />
          <TextView text={t('islamic.adhkar.loadingAudio')} variant="caption" muted />
        </>
      ) : null}
      <Spacer size="xxs" />
      <TextView text={t('islamic.adhkar.backgroundHint')} variant="caption" muted />
    </View>
  );
};

export default AdhkarAudioBar;
