import type {ThemeTokens} from '@theme/types';

export const resolveMerchantProductsStyles = (tokens: ThemeTokens) => ({
    row: {...tokens.layout.presets.rowBetween, alignItems: tokens.layout.alignItems.center},
    actions: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    productCard: {marginBottom: tokens.spacing.sm, gap: tokens.spacing.sm},
  });
