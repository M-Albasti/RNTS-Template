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
    },
    h1: {
      ...tokens.typography.h1,
      color: toneColor,
      textAlign: align,
    },
    h2: {
      ...tokens.typography.h2,
      color: toneColor,
      textAlign: align,
    },
    h3: {
      ...tokens.typography.h3,
      color: toneColor,
      textAlign: align,
    },
  };
};
