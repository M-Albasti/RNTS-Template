import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {spacing} from '@theme/tokens';

type SpacingKey = keyof typeof spacing;

interface SpacerProps {
  size?: SpacingKey;
  horizontal?: boolean;
}

const Spacer = ({size = 'md', horizontal = false}: SpacerProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens => {
    const sheet = StyleSheet.create({
      vNone: {height: tokens.spacing.none},
      vXxs: {height: tokens.spacing.xxs},
      vXs: {height: tokens.spacing.xs},
      vSm: {height: tokens.spacing.sm},
      vMd: {height: tokens.spacing.md},
      vLg: {height: tokens.spacing.lg},
      vXl: {height: tokens.spacing.xl},
      vXxl: {height: tokens.spacing.xxl},
      vXxxl: {height: tokens.spacing.xxxl},
      hNone: {width: tokens.spacing.none},
      hXxs: {width: tokens.spacing.xxs},
      hXs: {width: tokens.spacing.xs},
      hSm: {width: tokens.spacing.sm},
      hMd: {width: tokens.spacing.md},
      hLg: {width: tokens.spacing.lg},
      hXl: {width: tokens.spacing.xl},
      hXxl: {width: tokens.spacing.xxl},
      hXxxl: {width: tokens.spacing.xxxl},
    });

    return sheet;
  });

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
