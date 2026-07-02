import type {ThemeTokens} from '@theme/types';

export const resolveWalletCardsStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.rowBetween},
      badge: {
        backgroundColor: tokens.colors.primaryMuted,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        borderRadius: tokens.radius.sm,
      },
    });
