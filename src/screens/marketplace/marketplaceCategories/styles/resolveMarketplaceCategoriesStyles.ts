import type {ThemeTokens} from '@theme/types';

export const resolveMarketplaceCategoriesStyles = (tokens: ThemeTokens) => ({
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    chip: {
      width: '47%' as const,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      ...tokens.layout.presets.columnCenter,
      gap: tokens.spacing.xs,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
  });
