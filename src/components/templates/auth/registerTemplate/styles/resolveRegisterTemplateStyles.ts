import type {ThemeTokens} from '@theme/types';

export const resolveRegisterTemplateStyles = (tokens: ThemeTokens) => ({
    formWrap: {
      width: '100%' as const,
      maxWidth: 420,
    },
  });
