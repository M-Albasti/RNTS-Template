import type {ThemeTokens} from '@theme/types';

export const resolveMerchantReviewCardStyles = (tokens: ThemeTokens) => ({
    card: {gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    unreadDot: {
      width: tokens.sizes.ratingDot,
      height: tokens.sizes.ratingDot,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primary,
    },
    actions: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.sm,
    },
    replyBox: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
    },
  });
