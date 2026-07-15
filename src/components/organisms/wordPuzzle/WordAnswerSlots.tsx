import React, {useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import Animated, {FadeInDown, ZoomIn} from 'react-native-reanimated';

import TextView from '@atoms/TextView';

import {hasArabicScript} from '@helpers/hexGridHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  letters: string;
  solved?: boolean;
  /** @deprecated Selection chips use theme border colors; kept for call-site compatibility. */
  accentColor?: string;
  /** Hint chips use a blue border with no fill. */
  variant?: 'selection' | 'hint';
};

type SlotItem =
  | {type: 'char'; value: string; key: string}
  | {type: 'space'; key: string};

/**
 * Per-character chips in a fixed-height row (scrolls horizontally if long).
 * Spaces in `letters` render as a small gap between words.
 * Direction follows the script (Arabic → RTL, Latin → LTR), not the app language.
 */
const WordAnswerSlots = ({
  letters,
  solved = false,
  variant = 'selection',
}: Props): React.JSX.Element => {
  const isRtl = hasArabicScript(letters);
  const isHint = variant === 'hint';

  const styles = useThemedStyles(tokens => ({
    row: {
      height: 40,
      width: '100%' as const,
      justifyContent: 'center' as const,
      overflow: 'hidden' as const,
    },
    content: {
      flexGrow: 1,
      // Force LTR container so app UI language cannot flip chip order.
      flexDirection: isRtl ? ('row-reverse' as const) : ('row' as const),
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 2,
      paddingHorizontal: tokens.spacing.sm,
    },
    slot: {
      minWidth: 30,
      minHeight: 34,
      paddingHorizontal: tokens.spacing.sm,
      borderRadius: tokens.radius.full,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: solved
        ? tokens.colors.successMuted
        : isHint
          ? tokens.colors.surface
          : tokens.colors.surface,
      borderWidth: tokens.layout.borderWidth.lg,
      // Theme border (not the random selection accent fill).
      borderColor: solved
        ? tokens.colors.success
        : isHint
          ? tokens.colors.primary
          : tokens.colors.primary,
    },
    wordGap: {
      width: tokens.spacing.md,
      height: 34,
    },
    letter: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '700' as const,
      includeFontPadding: false,
      textAlign: 'center' as const,
      writingDirection: isRtl ? ('rtl' as const) : ('ltr' as const),
      color: solved ? tokens.colors.success : tokens.colors.textPrimary,
    },
  }), [isHint, isRtl, solved]);

  const items = useMemo((): SlotItem[] => {
    const result: SlotItem[] = [];
    let charIndex = 0;
    for (let index = 0; index < letters.length; index += 1) {
      const value = letters[index];
      if (/\s/.test(value)) {
        if (result.length > 0 && result[result.length - 1].type !== 'space') {
          result.push({type: 'space', key: `space-${index}`});
        }
        continue;
      }
      result.push({type: 'char', value, key: `char-${charIndex}-${value}`});
      charIndex += 1;
    }
    return result;
  }, [letters]);

  return (
    <View style={styles.row}>
      <ScrollView
        horizontal
        style={{direction: 'ltr'}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {items.map((item, index) => {
          if (item.type === 'space') {
            return <View key={item.key} style={styles.wordGap} />;
          }
          const isLastChar = items.slice(index + 1).every(next => next.type !== 'char');
          return (
            <Animated.View
              key={item.key}
              entering={
                isLastChar
                  ? ZoomIn.springify().damping(14).stiffness(220)
                  : FadeInDown.duration(140)
              }
              style={styles.slot}>
              <TextView text={item.value} style={styles.letter} align="center" />
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default WordAnswerSlots;
