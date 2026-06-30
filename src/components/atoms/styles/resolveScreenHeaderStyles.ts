import type {ThemeTokens} from '@theme/types';

export const resolveScreenHeaderStyles = (tokens: ThemeTokens) => ({
    row: {
      ...tokens.layout.presets.rowBetween,
      marginBottom: tokens.spacing.md,
      minHeight: tokens.sizes.touchTarget,
    },
    side: {
      width: tokens.sizes.touchTarget,
      ...tokens.layout.presets.center,
    },
    titleWrap: {
      flex: tokens.layout.flex.fill,
      alignItems: tokens.layout.alignItems.center,
    },
  });
