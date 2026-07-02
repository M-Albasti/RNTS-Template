import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  targetLength: number;
  filledLetters: string;
  solved: boolean;
};

const WordAnswerSlots = ({targetLength, filledLetters, solved}: Props): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    row: {...tokens.layout.presets.row, gap: tokens.spacing.xs, justifyContent: 'center' as const},
    slot: {
      minWidth: 28,
      paddingVertical: tokens.spacing.xs,
      paddingHorizontal: tokens.spacing.sm,
      borderRadius: tokens.radius.full,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: solved ? tokens.colors.success : tokens.colors.border,
      backgroundColor: solved ? tokens.colors.primaryMuted : tokens.colors.surfaceSecondary,
    },
  }));

  const letters = filledLetters.split('');
  const slots = Array.from({length: Math.max(targetLength, letters.length)}, (_, index) => letters[index] ?? '');

  return (
    <View style={styles.row}>
      {slots.map((letter, index) => (
        <View key={`${letter}-${index}`} style={styles.slot}>
          <TextView text={letter || '·'} variant="bodySmall" align="center" />
        </View>
      ))}
    </View>
  );
};

export default WordAnswerSlots;
