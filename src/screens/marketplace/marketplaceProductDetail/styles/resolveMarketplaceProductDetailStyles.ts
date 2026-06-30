import type {ThemeTokens} from '@theme/types';

export const resolveMarketplaceProductDetailStyles = (tokens: ThemeTokens) => ({
    strike: {textDecorationLine: 'line-through' as const, color: tokens.colors.textMuted},
    qtyRow: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.md,
    },
  });
