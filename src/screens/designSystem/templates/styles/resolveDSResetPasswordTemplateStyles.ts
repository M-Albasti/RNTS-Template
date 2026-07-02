import type {ThemeTokens} from '@theme/types';

export const resolveDSResetPasswordTemplateStyles = (tokens: ThemeTokens) => ({
    form: {width: '100%' as const, maxWidth: 420},
    inputs: {gap: tokens.spacing.sm},
  });
