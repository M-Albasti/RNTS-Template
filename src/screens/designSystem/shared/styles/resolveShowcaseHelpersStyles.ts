import type {ThemeTokens} from '@theme/types';

export const resolveShowcaseHelpersStyles = (tokens: ThemeTokens) => ({
    stack: {gap: tokens.spacing.sm},
    row: {
      flexDirection: tokens.layout.flexDirection.row,
      flexWrap: tokens.layout.flexWrap.wrap,
      gap: tokens.spacing.sm,
    },
  });
