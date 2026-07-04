import type {ThemeTokens} from '@theme/types';

export const resolveMarketplaceProductsStyles = (tokens: ThemeTokens) => ({
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  });
