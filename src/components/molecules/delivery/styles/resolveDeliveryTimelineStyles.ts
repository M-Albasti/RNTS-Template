import type {ThemeTokens} from '@theme/types';

export const resolveDeliveryTimelineStyles = (tokens: ThemeTokens) => ({
    list: {gap: tokens.spacing.sm},
    row: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      alignItems: tokens.layout.alignItems.start,
    },
    dot: {
      width: tokens.sizes.timelineDot,
      height: tokens.sizes.timelineDot,
      borderRadius: tokens.sizes.timelineDot / 2,
      backgroundColor: tokens.colors.primary,
      marginTop: tokens.spacing.xs,
    },
    content: {flex: tokens.layout.flex.fill, gap: tokens.spacing.xxs},
  });
