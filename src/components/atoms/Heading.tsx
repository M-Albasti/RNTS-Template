import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveHeadingStyles} from './styles/resolveHeadingStyles';
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
  const styles = useThemedStyles(
    tokens => resolveHeadingStyles(tokens, resolvedTone, align),
    [resolvedTone, align],
  );

  return (
    <Text {...textProps} style={[styles[level], style]}>
      {text}
    </Text>
  );
};

export default Heading;
