import type {ThemeTokens} from '@theme/types';

export const resolveDSVideoPlayerTemplateStyles = (tokens: ThemeTokens) => ({
    player: {
      flex: tokens.layout.flex.fill,
      borderRadius: tokens.radius.lg,
      overflow: tokens.layout.overflow.hidden,
      height: tokens.sizes.videoPlayer,
    },
  });
