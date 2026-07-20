import type {ThemeTokens} from '@theme/types';

/** Foode-inspired marketplace: search hero, category chips, action grid. */
export const resolveMarketplaceHubStyles = (tokens: ThemeTokens) => ({
  hero: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.xs,
  },
  searchHint: {
    marginTop: tokens.spacing.sm,
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.surfaceSecondary,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  categories: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  categoryChip: {
    width: '30%' as const,
    minWidth: 96,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    ...tokens.layout.presets.columnCenter,
    gap: tokens.spacing.xs,
    backgroundColor: tokens.colors.surface,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
});
