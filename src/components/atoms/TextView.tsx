import React from 'react';
import {Text, TextProps, View, ViewStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveTextViewStyles} from './styles/resolveTextViewStyles';
import type {TextAlign} from '@theme/types';

export type TextVariant = 'body' | 'bodySmall' | 'caption' | 'h3';

interface TextViewProps extends TextProps {
  containerStyle?: ViewStyle;
  text: string;
  variant?: TextVariant;
  muted?: boolean;
  align?: TextAlign;
  style?: TextProps['style'];
}

const TextView = ({
  containerStyle,
  text,
  variant = 'body',
  muted = false,
  align = 'left',
  style,
  ...textProps
}: TextViewProps): React.JSX.Element => {
  const styles = useThemedStyles(
    tokens => resolveTextViewStyles(tokens, muted, align),
    [muted, align],
  );

  return (
    <View style={containerStyle}>
      <Text {...textProps} style={[styles[variant], style]} numberOfLines={textProps.numberOfLines}>
        {text}
      </Text>
    </View>
  );
};

export default TextView;
