import type {ThemeTokens} from '@theme/types';

export const resolveWalletBudgetStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.rowBetween},
      bar: {
        height: tokens.spacing.sm,
        backgroundColor: tokens.colors.surfaceSecondary,
        borderRadius: tokens.radius.full,
        overflow: tokens.layout.overflow.hidden,
        marginTop: tokens.spacing.xs,
      },
      fill: {height: '100%', backgroundColor: tokens.colors.primary},
      over: {backgroundColor: tokens.colors.error},
    });
