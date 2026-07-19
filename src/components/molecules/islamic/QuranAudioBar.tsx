import React, {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {QURAN_RECITERS, type QuranReciter} from '@constants/quranReciters';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  reciterId: string;
  surahNumber?: number;
  activeAyahNumber?: number;
  isPlaying: boolean;
  isLoading?: boolean;
  continuous?: boolean;
  reciters?: QuranReciter[];
  onSelectReciter: (reciterId: string) => void;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const QuranAudioBar = ({
  reciterId,
  surahNumber,
  activeAyahNumber,
  isPlaying,
  isLoading,
  continuous = true,
  reciters = QURAN_RECITERS,
  onSelectReciter,
  onTogglePlay,
  onPrevious,
  onNext,
}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const {sizes} = useThemeTokens();
  const isAr = i18n.language.startsWith('ar');
  const [showAll, setShowAll] = useState(false);
  const reciter = reciters.find(item => item.id === reciterId) ?? reciters[0];
  const visibleReciters = showAll ? reciters : reciters.slice(0, 8);

  const styles = useThemedStyles(tokens => ({
    wrap: {
      borderTopWidth: tokens.layout.borderWidth.sm,
      borderTopColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.md,
      ...tokens.shadows.lg,
    },
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
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
    controls: {...tokens.layout.presets.row, gap: tokens.spacing.md, alignItems: 'center' as const},
    badge: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 2,
      marginTop: tokens.spacing.xxs,
    },
  }));

  const subtitle =
    continuous && activeAyahNumber
      ? t('islamic.quran.ayahAccuratePlayback', {
          surah: surahNumber ?? 1,
          ayah: activeAyahNumber,
        })
      : continuous
        ? t('islamic.quran.continuousSurah', {n: surahNumber ?? 1})
        : t('islamic.quran.ayahN', {n: activeAyahNumber ?? 1});

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <Heading text={isAr ? reciter.nameAr : reciter.nameEn} level="h3" />
          <View style={styles.badge}>
            <TextView text={subtitle} variant="caption" />
          </View>
        </View>
        <View style={styles.controls}>
          <TouchableIcon
            iconType="Ionicons"
            name="play-skip-back"
            size={sizes.iconSm}
            onPress={onPrevious}
          />
          <TouchableIcon
            iconType="Ionicons"
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={sizes.iconLg ?? sizes.iconMd}
            onPress={onTogglePlay}
          />
          <TouchableIcon
            iconType="Ionicons"
            name="play-skip-forward"
            size={sizes.iconSm}
            onPress={onNext}
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipRow}>
        {visibleReciters.map(item => (
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
        {reciters.length > 8 ? (
          <Pressable style={styles.chip} onPress={() => setShowAll(current => !current)}>
            <TextView
              text={showAll ? t('islamic.common.less') : t('islamic.common.more')}
              variant="caption"
            />
          </Pressable>
        ) : null}
      </ScrollView>
      {isLoading ? (
        <>
          <Spacer size="xs" />
          <TextView text={t('islamic.quran.loadingAudio')} variant="caption" muted />
        </>
      ) : null}
      <Spacer size="xxs" />
      <TextView text={t('islamic.quran.backgroundHint')} variant="caption" muted />
    </View>
  );
};

export default QuranAudioBar;
