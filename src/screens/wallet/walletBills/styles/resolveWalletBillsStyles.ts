import type {ThemeTokens} from '@theme/types';

export const resolveWalletBillsStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.rowBetween},
      paid: {opacity: 0.5},
    });
