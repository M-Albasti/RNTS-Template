import type {ThemeTokens} from '@theme/types';

export const resolveMockOtpTemplateStyles = (tokens: ThemeTokens) => ({
    form: {
      width: '100%' as const,
      maxWidth: 420,
    },
  });
