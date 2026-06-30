import type {ThemeTokens} from '@theme/types';

export const resolveAuthMethodsButtonsStyles = (tokens: ThemeTokens) => ({
    container: {
      width: '100%' as const,
      maxWidth: 400,
      gap: tokens.spacing.sm,
    },
  });
