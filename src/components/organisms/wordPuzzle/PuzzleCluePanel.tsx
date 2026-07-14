import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {WordPuzzleClue} from '@Types/wordPuzzleTypes';

type Props = {
  clue: WordPuzzleClue;
  language: 'ar' | 'en';
  levelLabel: string;
};

const getClueText = (clue: WordPuzzleClue, t: (key: string) => string) => {
  if ('text' in clue && clue.text) {
    return clue.text;
  }
  if ('textKey' in clue && clue.textKey) {
    return t(clue.textKey);
  }
  return '';
};

const PuzzleCluePanel = ({clue, language, levelLabel}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    card: {
      flex: 1,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.shadows.md,
    },
    emojiRow: {
      ...tokens.layout.presets.row,
      flexWrap: 'wrap' as const,
      gap: tokens.spacing.sm,
      justifyContent: 'center' as const,
    },
    emoji: {fontSize: 32},
    text: {
      textAlign: language === 'ar' ? ('right' as const) : ('left' as const),
      writingDirection: language === 'ar' ? ('rtl' as const) : ('ltr' as const),
    },
  }));

  const clueText = getClueText(clue, t);

  return (
    <View style={styles.card}>
      <TextView text={levelLabel} variant="caption" muted numberOfLines={1} />
      <Spacer size="xs" />
      {clue.type === 'image_riddle' ? (
        <>
          <View style={styles.emojiRow}>
            {clue.emojis.map(item => (
              <TextView key={item} text={item} style={styles.emoji} />
            ))}
          </View>
          {clueText ? (
            <>
              <Spacer size="xs" />
              <TextView
                text={clueText}
                variant="bodySmall"
                style={styles.text}
                muted
                numberOfLines={3}
              />
            </>
          ) : null}
        </>
      ) : (
        <TextView
          text={clueText}
          variant="h3"
          style={styles.text}
          align={language === 'ar' ? 'right' : 'left'}
          numberOfLines={4}
        />
      )}
    </View>
  );
};

export default PuzzleCluePanel;
