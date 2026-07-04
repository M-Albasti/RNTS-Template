import type {ThemeTokens} from '@theme/types';

export const resolveForgetPasswordTemplateStyles = (tokens: ThemeTokens) => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
      gap: tokens.spacing.sm,
    },
  });
