import type {ThemeTokens} from '@theme/types';

export const resolveVideoPlayerTemplateStyles = (tokens: ThemeTokens) => ({
    player: {
      flex: tokens.layout.flex.fill,
      borderRadius: tokens.radius.lg,
      overflow: 'hidden' as const,
    },
  });
