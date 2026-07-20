import type {ThemeTokens} from '@theme/types';

/** Focusify-inspired home: clean greeting header, soft stat chips, section grids. */
export const resolveHomeStyles = (tokens: ThemeTokens) => ({
  hero: {
    ...tokens.layout.presets.row,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  heroCopy: {
    flex: tokens.layout.flex.fill,
    gap: tokens.spacing.xxs,
  },
  heroEyebrow: {
    color: tokens.colors.textMuted,
  },
  menuButton: {
    width: tokens.sizes.touchTarget,
    height: tokens.sizes.touchTarget,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.surface,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    ...tokens.layout.presets.center,
    ...tokens.shadows.sm,
  },
  statsRow: {
    ...tokens.layout.presets.row,
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  statPill: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.xxs,
    alignItems: 'center' as const,
  },
  sectionBlock: {
    marginBottom: tokens.spacing.lg,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  quickBlock: {
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  quickGrid: {
    ...tokens.layout.presets.row,
    flexWrap: 'wrap' as const,
    gap: tokens.spacing.sm,
  },
  quickTile: {
    width: '48%' as const,
    flexGrow: 1,
    minWidth: '46%' as const,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.sm,
    ...tokens.shadows.sm,
  },
  quickTilePressed: {
    backgroundColor: tokens.colors.surfaceSecondary,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.primaryMuted,
    ...tokens.layout.presets.center,
  },
  logoutRow: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: tokens.spacing.sm,
    minHeight: tokens.sizes.touchTarget,
    borderRadius: tokens.radius.full,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.errorMuted,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.lg,
  },
  logoutRowPressed: {
    backgroundColor: tokens.colors.errorMuted,
  },
  logoutLabel: {
    color: tokens.colors.error,
    fontWeight: '600' as const,
  },
  sheetOption: {
    ...tokens.layout.presets.rowBetween,
    alignItems: 'center' as const,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    borderRadius: tokens.radius.lg,
  },
  sheetOptionActive: {
    backgroundColor: tokens.colors.primaryMuted,
  },
  sheetActions: {
    ...tokens.layout.presets.row,
    gap: tokens.spacing.sm,
  },
  sheetActionButton: {
    flex: tokens.layout.flex.fill,
  },
  apiBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: tokens.colors.primaryMuted,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xxs,
    marginTop: tokens.spacing.xs,
  },
});
