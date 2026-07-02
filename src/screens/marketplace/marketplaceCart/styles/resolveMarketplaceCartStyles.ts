import type {ThemeTokens} from '@theme/types';

export const resolveMarketplaceCartStyles = (tokens: ThemeTokens) => ({
    card: {marginBottom: tokens.spacing.sm, gap: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween, alignItems: tokens.layout.alignItems.center},
    qtyRow: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      alignItems: tokens.layout.alignItems.center,
    },
  });
