import React from 'react';
import {View} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveSpacerStyles} from './styles/resolveSpacerStyles';
import {spacing} from '@theme/tokens';

type SpacingKey = keyof typeof spacing;

interface SpacerProps {
  size?: SpacingKey;
  horizontal?: boolean;
}

const Spacer = ({size = 'md', horizontal = false}: SpacerProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveSpacerStyles);

  const verticalMap = {
    none: styles.vNone,
    xxs: styles.vXxs,
    xs: styles.vXs,
    sm: styles.vSm,
    md: styles.vMd,
    lg: styles.vLg,
    xl: styles.vXl,
    xxl: styles.vXxl,
    xxxl: styles.vXxxl,
  } as const;

  const horizontalMap = {
    none: styles.hNone,
    xxs: styles.hXxs,
    xs: styles.hXs,
    sm: styles.hSm,
    md: styles.hMd,
    lg: styles.hLg,
    xl: styles.hXl,
    xxl: styles.hXxl,
    xxxl: styles.hXxxl,
  } as const;

  return <View style={horizontal ? horizontalMap[size] : verticalMap[size]} />;
};

export default Spacer;
