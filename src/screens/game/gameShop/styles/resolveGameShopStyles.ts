import type {ThemeTokens} from '@theme/types';

export const resolveGameShopStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.rowBetween},
      meta: {flex: tokens.layout.flex.fill, paddingRight: tokens.spacing.sm},
    });
