import type {ThemeTokens} from '@theme/types';

export const resolveVideoViewStyles = (tokens: ThemeTokens) => ({
      videoBackground: {
        flex: tokens.layout.flex.fill,
        backgroundColor: tokens.colors.textPrimary,
        borderRadius: tokens.radius.lg,
      },
    });
