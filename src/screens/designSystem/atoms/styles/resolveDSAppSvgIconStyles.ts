import type {ThemeTokens} from '@theme/types';

export const resolveDSAppSvgIconStyles = (tokens: ThemeTokens) => ({
    iconItem: {
      alignItems: tokens.layout.alignItems.center,
      gap: tokens.spacing.xs,
    },
  });
