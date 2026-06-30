import type {ThemeTokens} from '@theme/types';

export const resolveFirebaseLoginMethodTemplateStyles = (tokens: ThemeTokens) => ({
    wrap: {
      width: '100%' as const,
      maxWidth: 420,
      gap: tokens.spacing.sm,
    },
  });
