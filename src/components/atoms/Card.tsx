import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveCardStyles} from './styles/resolveCardStyles';

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
  const styles = useThemedStyles(
    tokens => resolveCardStyles(tokens, padded),
    [padded],
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
