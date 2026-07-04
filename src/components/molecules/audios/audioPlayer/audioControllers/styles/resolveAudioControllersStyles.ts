import type {ThemeTokens} from '@theme/types';

export const resolveAudioControllersStyles = (tokens: ThemeTokens) => ({
      root: {
        width: '100%',
        ...tokens.layout.presets.rowBetween,
        paddingHorizontal: tokens.spacing.xl,
        paddingTop: tokens.spacing.md,
      },
      playButton: {
        width: tokens.sizes.audioControl,
        height: tokens.sizes.audioControl,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.primaryMuted,
        ...tokens.layout.presets.center,
        ...tokens.shadows.sm,
      },
    });
