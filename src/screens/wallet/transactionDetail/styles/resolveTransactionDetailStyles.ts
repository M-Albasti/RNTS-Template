import type {ThemeTokens} from '@theme/types';

export const resolveTransactionDetailStyles = (tokens: ThemeTokens) => ({
      amount: {
        ...tokens.layout.presets.textCenter,
        ...tokens.typography.h1,
      },
      credit: {color: tokens.colors.success},
      debit: {color: tokens.colors.error},
      row: {...tokens.layout.presets.rowBetween},
    });
