import type {ThemeTokens} from '@theme/types';

export const resolveAudioProgressBarStyles = (tokens: ThemeTokens) => ({
      root: {
        width: '100%',
        ...tokens.layout.presets.row,
        paddingHorizontal: tokens.spacing.lg,
        gap: tokens.spacing.sm,
      },
      slider: {
        flex: tokens.layout.flex.fill,
        height: tokens.sizes.progressBar,
      },
      time: {
        minWidth: tokens.sizes.touchTarget,
        textAlign: tokens.layout.textAlign.center,
      },
    });
