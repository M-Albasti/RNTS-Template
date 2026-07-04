import type {ThemeTokens} from '@theme/types';

export const resolveThemeShowcaseStyles = (tokens: ThemeTokens) => ({
    swatchItem: {
      alignItems: tokens.layout.alignItems.center,
      gap: tokens.spacing.xs,
      width: tokens.sizes.showcaseRow,
    },
    swatch: {
      width: tokens.sizes.showcaseSwatch,
      height: tokens.sizes.showcaseSwatch,
      borderRadius: tokens.radius.sm,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
  });
