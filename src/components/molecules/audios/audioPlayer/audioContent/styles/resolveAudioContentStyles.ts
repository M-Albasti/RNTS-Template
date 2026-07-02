import type {ThemeTokens} from '@theme/types';

export const resolveAudioContentStyles = (tokens: ThemeTokens) => ({
      artworkWrap: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg,
      },
      artwork: {
        width: '78%',
        aspectRatio: 1,
        borderRadius: tokens.radius.xl,
        backgroundColor: tokens.colors.surfaceSecondary,
        ...tokens.shadows.md,
      },
      meta: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg,
        paddingTop: tokens.spacing.lg,
        gap: tokens.spacing.xs,
      },
    });
