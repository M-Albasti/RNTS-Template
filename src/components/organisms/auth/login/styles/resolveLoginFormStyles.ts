import type {ThemeTokens} from '@theme/types';

export const resolveLoginFormStyles = (tokens: ThemeTokens) => ({
    container: {
      width: '100%' as const,
      maxWidth: 420,
    },
    inputs: {
      gap: tokens.spacing.sm,
    },
  });
