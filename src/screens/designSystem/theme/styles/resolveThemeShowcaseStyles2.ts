import type {ThemeTokens} from '@theme/types';

export const resolveThemeShowcaseStyles2 = (tokens: ThemeTokens) => ({
    row: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
    },
    label: {width: tokens.sizes.showcaseSwatch},
    bar: {height: tokens.spacing.md},
  });
