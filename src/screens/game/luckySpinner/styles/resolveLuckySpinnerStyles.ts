import type {ThemeTokens} from '@theme/types';

export const resolveLuckySpinnerStyles = (tokens: ThemeTokens) => ({
    wheel: {
      width: tokens.sizes.spinner,
      height: tokens.sizes.spinner,
      borderRadius: tokens.radius.full,
      borderWidth: tokens.layout.borderWidth.lg,
      borderColor: tokens.colors.primary,
      ...tokens.layout.presets.selfCenter,
      ...tokens.layout.presets.center,
      backgroundColor: tokens.colors.surfaceSecondary,
    },
    segmentRow: {
      ...tokens.layout.presets.wrapRow,
      ...tokens.layout.presets.rowCenter,
      gap: tokens.spacing.xs,
    },
    segment: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radius.sm,
      backgroundColor: tokens.colors.primaryMuted,
    },
    stats: {
      ...tokens.layout.presets.columnCenter,
      gap: tokens.spacing.xs,
    },
    links: {gap: tokens.spacing.sm},
  });
