import type {ThemeTokens} from '@theme/types';

export const resolveDeliveryMapStyles = (tokens: ThemeTokens) => ({
    wrapper: {
      width: '100%' as const,
      borderRadius: tokens.radius.lg,
      overflow: tokens.layout.overflow.hidden,
    },
    fullScreen: {
      flex: tokens.layout.flex.fill,
      borderRadius: tokens.radius.none,
    },
    liveBadge: {
      position: tokens.layout.position.absolute,
      top: tokens.spacing.md,
      right: tokens.spacing.md,
      zIndex: tokens.layout.zIndex.sticky,
      backgroundColor: tokens.colors.liveBadge,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
    },
    liveDot: {
      width: tokens.spacing.sm,
      height: tokens.spacing.sm,
      borderRadius: tokens.radius.sm,
      backgroundColor: tokens.colors.onLiveBadge,
    },
  });
