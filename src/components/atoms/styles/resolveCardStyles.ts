import {StyleSheet} from 'react-native';

import type {ThemeTokens} from '@theme/types';

export const resolveCardStyles = (tokens: ThemeTokens, padded: boolean) => ({
  base: {
    overflow: tokens.layout.overflow.hidden,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderColor: tokens.colors.border,
    padding: padded ? tokens.spacing.lg : tokens.spacing.none,
  },
  outline: {
    borderWidth: tokens.layout.borderWidth.sm,
  },
  elevated: {
    ...tokens.shadows.md,
  },
  constrained: {
    width: '100%' as const,
    maxWidth: tokens.sizes.videoPreviewLg,
  },
});
