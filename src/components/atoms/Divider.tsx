import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';

interface DividerProps {
  style?: ViewStyle;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const Divider = ({style, spacing = 'md'}: DividerProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: tokens.colors.border,
      },
      none: {marginVertical: tokens.spacing.none},
      sm: {marginVertical: tokens.spacing.sm},
      md: {marginVertical: tokens.spacing.md},
      lg: {marginVertical: tokens.spacing.lg},
    }),
  );

  const spacingStyle = styles[spacing];

  return <View style={[styles.line, spacingStyle, style]} />;
};

export default Divider;
