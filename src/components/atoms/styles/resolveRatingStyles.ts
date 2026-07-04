import type {ThemeTokens} from '@theme/types';

export const resolveRatingStyles = (tokens: ThemeTokens) => ({
    fillClip: {
      ...tokens.layout.presets.clipOverlayTopLeft,
    },
  });
