import type {ThemeTokens} from '@theme/types';

export const resolveHomeStyles = (tokens: ThemeTokens) => ({
  hero: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    ...tokens.layout.presets.columnCenter,
    ...tokens.shadows.md,
    borderBottomWidth: 4,
    borderBottomColor: tokens.colors.accent3,
  },
  heroText: {color: tokens.colors.textInverse},
  statsRow: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  statPill: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    minWidth: '46%' as const,
    flex: tokens.layout.flex.fill,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    ...tokens.shadows.sm,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  actions: {gap: tokens.spacing.sm},
  workflowStep: {
    borderLeftWidth: tokens.layout.borderWidth.md,
    borderLeftColor: tokens.colors.primary,
    paddingLeft: tokens.spacing.md,
    gap: tokens.spacing.xxs,
  },
  apiBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: tokens.colors.surfaceSecondary,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xxs,
  },
});
