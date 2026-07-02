import type {ThemeTokens} from '@theme/types';

export const resolveGameLeaderboardStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.rowBetween},
      rank: {
        width: tokens.sizes.leaderboardRank,
        ...tokens.layout.presets.textCenter,
        ...tokens.typography.h3,
      },
      highlight: {
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.primary,
      },
    });
