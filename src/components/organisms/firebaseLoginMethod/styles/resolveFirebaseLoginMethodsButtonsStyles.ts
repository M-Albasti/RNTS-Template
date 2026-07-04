import type {ThemeTokens} from '@theme/types';

export const resolveFirebaseLoginMethodsButtonsStyles = (tokens: ThemeTokens) => ({
    container: {
      width: '100%' as const,
      gap: tokens.spacing.sm,
    },
  });
