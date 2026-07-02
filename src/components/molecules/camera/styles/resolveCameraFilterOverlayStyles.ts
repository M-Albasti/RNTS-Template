import type {ThemeTokens} from '@theme/types';

export const resolveCameraFilterOverlayStyles = (tokens: ThemeTokens) => ({
    overlay: {
      ...tokens.layout.presets.absoluteFill,
    },
  });
