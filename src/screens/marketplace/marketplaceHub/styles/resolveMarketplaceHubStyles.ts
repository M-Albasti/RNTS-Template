import type {ThemeTokens} from '@theme/types';

export const resolveMarketplaceHubStyles = (tokens: ThemeTokens) => ({
    hero: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    categories: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    categoryChip: {
      width: '30%' as const,
      minWidth: 96,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      ...tokens.layout.presets.columnCenter,
      gap: tokens.spacing.xs,
    },
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  });
