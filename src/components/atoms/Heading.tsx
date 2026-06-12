import React from 'react';
import {StyleSheet, Text, TextProps, TextStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {TextAlign} from '@theme/types';

export type HeadingLevel = 'display' | 'h1' | 'h2' | 'h3';
export type HeadingTone = 'default' | 'muted' | 'primary';

interface HeadingProps extends TextProps {
  text: string;
  level?: HeadingLevel;
  /** @deprecated Prefer `tone="muted"` */
  muted?: boolean;
  tone?: HeadingTone;
  align?: TextAlign;
  style?: TextStyle;
}

const Heading = ({
  text,
  level = 'h1',
  muted = false,
  tone,
  align = 'left',
  style,
  ...textProps
}: HeadingProps): React.JSX.Element => {
  const resolvedTone = tone ?? (muted ? 'muted' : 'default');
  const styles = useThemedStyles(tokens => {
    const toneColor =
      resolvedTone === 'muted'
        ? tokens.colors.textSecondary
        : resolvedTone === 'primary'
          ? tokens.colors.primary
          : tokens.colors.textPrimary;

    return StyleSheet.create({
      display: {
        ...tokens.typography.display,
        color: toneColor,
        textAlign: align,
      },
      h1: {
        ...tokens.typography.h1,
        color: toneColor,
        textAlign: align,
      },
      h2: {
        ...tokens.typography.h2,
        color: toneColor,
        textAlign: align,
      },
      h3: {
        ...tokens.typography.h3,
        color: toneColor,
        textAlign: align,
      },
    });
  });

  return (
    <Text {...textProps} style={[styles[level], style]}>
      {text}
    </Text>
  );
};

export default Heading;
