import type {ThemeTokens} from '@theme/types';

export const resolveAuthMethodRowStyles = (tokens: ThemeTokens) => ({
  row: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.md,
    minHeight: 56,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.full,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
  },
  rowPressed: {
    backgroundColor: tokens.colors.surfaceSecondary,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primaryMuted,
    ...tokens.layout.presets.center,
  },
  copy: {
    flex: tokens.layout.flex.fill,
    gap: 2,
  },
  label: {
    fontWeight: '600' as const,
  },
});
