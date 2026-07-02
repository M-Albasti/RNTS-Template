import type {ThemeTokens} from '@theme/types';

export const resolveDeliveryHubStyles = (tokens: ThemeTokens) => ({
    hero: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      ...tokens.layout.presets.columnCenter,
    },
    heroText: {color: tokens.colors.textInverse},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  });
