import type {ThemeTokens} from '@theme/types';

export const resolveRatingStyles2 = (tokens: ThemeTokens) => ({
    row: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.xs,
    },
    stars: {
      ...tokens.layout.presets.row,
      gap: tokens.rating.starGap,
    },
  });
