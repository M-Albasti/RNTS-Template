import type {ThemeTokens} from '@theme/types';

/** Focusify/Taska-inspired todo hub. */
export const resolveTodoHubStyles = (tokens: ThemeTokens) => ({
  hero: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  stats: {
    ...tokens.layout.presets.row,
    gap: tokens.spacing.sm,
  },
  statChip: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.primaryMuted,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    alignItems: 'center' as const,
    gap: tokens.spacing.xxs,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
});
