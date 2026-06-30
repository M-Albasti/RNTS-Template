import {StyleSheet} from 'react-native';

import type {ThemeTokens} from '@theme/types';

export const resolveDividerStyles = (tokens: ThemeTokens) => ({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.border,
  },
  none: {marginVertical: tokens.spacing.none},
  sm: {marginVertical: tokens.spacing.sm},
  md: {marginVertical: tokens.spacing.md},
  lg: {marginVertical: tokens.spacing.lg},
});
