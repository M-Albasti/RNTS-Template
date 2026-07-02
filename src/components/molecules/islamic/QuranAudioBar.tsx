import React from 'react';
import {Pressable, View} from 'react-native';

import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {QURAN_RECITERS} from '@constants/quranReciters';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  reciterId: string;
  activeAyahNumber: number;
  isPlaying: boolean;
  isLoading?: boolean;
  onSelectReciter: (reciterId: string) => void;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const QuranAudioBar = ({
  reciterId,
  activeAyahNumber,
  isPlaying,
  isLoading,
  onSelectReciter,
  onTogglePlay,
  onPrevious,
  onNext,
}: Props): React.JSX.Element => {
  const {sizes} = useThemeTokens();
  const reciter = QURAN_RECITERS.find(item => item.id === reciterId) ?? QURAN_RECITERS[0];
  const styles = useThemedStyles(tokens => ({
    wrap: {
      borderTopWidth: tokens.layout.borderWidth.sm,
      borderTopColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.md,
    },
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    chips: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs, marginTop: tokens.spacing.sm},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
    chipActive: {
      backgroundColor: tokens.colors.primaryMuted,
      borderColor: tokens.colors.primary,
    },
    controls: {...tokens.layout.presets.row, gap: tokens.spacing.md, alignItems: 'center' as const},
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View>
          <Heading text={reciter.nameAr} level="h3" />
          <TextView text={`آية ${activeAyahNumber}`} variant="caption" muted />
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
            size={sizes.iconMd}
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
      <View style={styles.chips}>
        {QURAN_RECITERS.slice(0, 6).map(item => (
          <Pressable
            key={item.id}
            style={[styles.chip, reciterId === item.id && styles.chipActive]}
            onPress={() => onSelectReciter(item.id)}>
            <TextView text={item.nameAr} variant="caption" />
          </Pressable>
        ))}
      </View>
      {isLoading ? (
        <>
          <Spacer size="xs" />
          <TextView text="..." variant="caption" muted />
        </>
      ) : null}
    </View>
  );
};

export default QuranAudioBar;
