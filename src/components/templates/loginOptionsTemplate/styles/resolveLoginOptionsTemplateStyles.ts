import type {ThemeTokens} from '@theme/types';

/** Focusify welcome: soft divider + outlined pill method rows. */
export const resolveLoginOptionsTemplateStyles = (tokens: ThemeTokens) => ({
  dividerRow: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
    marginVertical: tokens.spacing.lg,
  },
  dividerLine: {
    flex: tokens.layout.flex.fill,
    height: tokens.layout.borderWidth.sm,
    backgroundColor: tokens.colors.border,
  },
  socialBtn: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
    gap: tokens.spacing.md,
    minHeight: 56,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.full,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
  },
  socialLabel: {
    color: tokens.colors.textPrimary,
    fontWeight: '600' as const,
  },
});
