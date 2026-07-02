import type {ThemeTokens} from '@theme/types';

export const resolveLiveTrackingCardStyles = (tokens: ThemeTokens) => ({
    card: {gap: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    livePill: {
      backgroundColor: tokens.colors.error,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
    liveText: {color: tokens.colors.textInverse},
    progressTrack: {
      height: tokens.sizes.progressTrack,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.border,
      overflow: tokens.layout.overflow.hidden,
    },
    progressFill: {
      height: tokens.sizes.progressTrack,
      backgroundColor: tokens.colors.primary,
    },
  });
