import type {ThemeTokens} from '@theme/types';

export const resolveVideoWithButtonsStyles = (tokens: ThemeTokens) => ({
      container: {
        flex: tokens.layout.flex.fill,
        backgroundColor: tokens.colors.background,
      },
      player: {
        flex: tokens.layout.flex.fill,
      },
    });
