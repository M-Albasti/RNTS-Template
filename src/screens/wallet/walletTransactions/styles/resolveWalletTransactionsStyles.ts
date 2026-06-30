import type {ThemeTokens} from '@theme/types';

export const resolveWalletTransactionsStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.rowBetween},
      credit: {color: tokens.colors.success},
      debit: {color: tokens.colors.error},
    });
