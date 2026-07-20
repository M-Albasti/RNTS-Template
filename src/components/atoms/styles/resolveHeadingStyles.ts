import type {ThemeTokens, TextAlign} from '@theme/types';

type HeadingTone = 'default' | 'muted' | 'primary';

export const resolveHeadingStyles = (
  tokens: ThemeTokens,
  resolvedTone: HeadingTone,
  align: TextAlign,
) => {
  const toneColor =
    resolvedTone === 'muted'
      ? tokens.colors.textSecondary
      : resolvedTone === 'primary'
        ? tokens.colors.primary
        : tokens.colors.textPrimary;

  return {
    display: {
      ...tokens.typography.display,
      color: toneColor,
      textAlign: align,
      // Cairo/Arabic ascenders clip without top padding on Android.
      paddingTop: tokens.spacing.sm,
      includeFontPadding: false,
    },
    h1: {
      ...tokens.typography.h1,
      color: toneColor,
      textAlign: align,
      paddingTop: tokens.spacing.sm,
      includeFontPadding: false,
    },
    h2: {
      ...tokens.typography.h2,
      color: toneColor,
      textAlign: align,
      paddingTop: tokens.spacing.xs,
      includeFontPadding: false,
    },
    h3: {
      ...tokens.typography.h3,
      color: toneColor,
      textAlign: align,
      includeFontPadding: false,
    },
  };
};
