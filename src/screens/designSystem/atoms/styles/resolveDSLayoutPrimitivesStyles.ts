import type {ThemeTokens} from '@theme/types';

export const resolveDSLayoutPrimitivesStyles = (tokens: ThemeTokens, primaryColor: string) => ({
  marker: {
    backgroundColor: primaryColor,
    height: tokens.sizes.markerLine,
  },
});
