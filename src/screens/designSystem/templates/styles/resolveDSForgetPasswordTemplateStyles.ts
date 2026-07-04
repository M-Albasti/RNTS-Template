import type {ThemeTokens} from '@theme/types';

export const resolveDSForgetPasswordTemplateStyles = (tokens: ThemeTokens) => ({
    form: {width: '100%' as const, maxWidth: 420, gap: tokens.spacing.sm},
  });
