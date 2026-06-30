import type {ThemeTokens} from '@theme/types';

export const resolveResetPasswordTemplateStyles = (tokens: ThemeTokens) => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
      gap: tokens.spacing.sm,
    },
    inputs: {
      gap: tokens.spacing.sm,
    },
  });
