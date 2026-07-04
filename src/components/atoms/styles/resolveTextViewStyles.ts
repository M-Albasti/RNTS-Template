import type {ThemeTokens} from '@theme/types';
import type {TextAlign} from '@theme/types';

export const resolveTextViewStyles = (
  tokens: ThemeTokens,
  muted: boolean,
  align: TextAlign,
) => {
  const color = muted ? tokens.colors.textMuted : tokens.colors.textPrimary;

  return {
    body: {
      ...tokens.typography.body,
      color,
      textAlign: align,
    },
    bodySmall: {
      ...tokens.typography.bodySmall,
      color,
      textAlign: align,
    },
    caption: {
      ...tokens.typography.caption,
      color,
      textAlign: align,
    },
    h3: {
      ...tokens.typography.h3,
      color,
      textAlign: align,
    },
  };
};
