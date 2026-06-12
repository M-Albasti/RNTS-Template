import React from 'react';
import {StyleSheet, View, ViewProps, ViewStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
  padded?: boolean;
  constrained?: boolean;
  style?: ViewStyle;
}

const Card = ({
  children,
  elevated = true,
  padded = true,
  constrained = false,
  style,
  ...viewProps
}: CardProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      base: {
        overflow: 'hidden',
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.border,
        padding: padded ? tokens.spacing.lg : tokens.spacing.none,
      },
      outline: {
        borderWidth: 1,
      },
      elevated: {
        ...tokens.shadows.md,
      },
      constrained: {
        width: '100%',
        maxWidth: 360,
      },
    }),
  );

  return (
    <View
      {...viewProps}
      style={[
        styles.base,
        elevated ? styles.elevated : styles.outline,
        constrained && styles.constrained,
        style,
      ]}>
      {children}
    </View>
  );
};

export default Card;
