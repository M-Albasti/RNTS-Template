import type {ThemeTokens} from '@theme/types';

/** Foode-inspired delivery hub: soft search hero + category-style action grid. */
export const resolveDeliveryHubStyles = (tokens: ThemeTokens) => ({
  hero: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.xs,
  },
  searchBar: {
    marginTop: tokens.spacing.sm,
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.surfaceSecondary,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  modeChip: {
    alignSelf: 'flex-start' as const,
    marginTop: tokens.spacing.sm,
    backgroundColor: tokens.colors.primaryMuted,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xxs,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
});
