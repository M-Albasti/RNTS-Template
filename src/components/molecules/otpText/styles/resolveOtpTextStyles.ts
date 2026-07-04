import type {ThemeTokens} from '@theme/types';

export const resolveOtpTextStyles = (tokens: ThemeTokens) => ({
    title: {
      ...tokens.typography.h2,
      marginBottom: tokens.spacing.md,
      textAlign: tokens.layout.textAlign.center,
      color: tokens.colors.textPrimary,
    },
    subtitle: {
      ...tokens.typography.body,
      color: tokens.colors.textMuted,
      marginBottom: tokens.spacing.xxl,
      textAlign: tokens.layout.textAlign.center,
    },
  });
