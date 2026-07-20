import type {ThemeTokens} from '@theme/types';

export const resolveSettingsStyles = (tokens: ThemeTokens) => ({
  section: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    overflow: 'hidden' as const,
  },
  sectionTitle: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
  },
  row: {
    ...tokens.layout.presets.rowBetween,
    alignItems: 'center' as const,
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    minHeight: tokens.sizes.touchTarget + 8,
  },
  rowPressed: {
    backgroundColor: tokens.colors.surfaceSecondary,
  },
  rowCopy: {
    flex: tokens.layout.flex.fill,
    gap: 2,
    minWidth: 0,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.primaryMuted,
    ...tokens.layout.presets.center,
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
  dangerRow: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
});
