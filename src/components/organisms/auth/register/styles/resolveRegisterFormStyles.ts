import type {ThemeTokens} from '@theme/types';

export const resolveRegisterFormStyles = (tokens: ThemeTokens) => ({
  container: {
    width: '100%' as const,
    gap: tokens.spacing.md,
  },
  inputs: {
    gap: tokens.spacing.md,
  },
});
