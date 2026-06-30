import type {ThemeTokens} from '@theme/types';

export const resolveActiveOrdersStyles = (tokens: ThemeTokens) => ({
    card: {gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween},
    badgeRow: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
    livePill: {
      backgroundColor: tokens.colors.error,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
    liveText: {color: tokens.colors.textInverse},
  });
