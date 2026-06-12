import React from 'react';
import {StyleSheet, Text, TextProps, View, ViewStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
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
  const styles = useThemedStyles(tokens => {
    const color = muted ? tokens.colors.textMuted : tokens.colors.textPrimary;

    return StyleSheet.create({
      body: {
        ...tokens.typography.body,
        color,
        textAlign: align,
      },
      bodySmall: {
        ...tokens.typography.bodySmall,
        color,
        textAlign: align,
      },
      caption: {
        ...tokens.typography.caption,
        color,
        textAlign: align,
      },
      h3: {
        ...tokens.typography.h3,
        color,
        textAlign: align,
      },
    });
  });

  return (
    <View style={containerStyle}>
      <Text {...textProps} style={[styles[variant], style]} numberOfLines={textProps.numberOfLines}>
        {text}
      </Text>
    </View>
  );
};

export default TextView;
