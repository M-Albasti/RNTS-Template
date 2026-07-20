import type {ThemeTokens} from '@theme/types';

/** Focusify login form: remember/forgot row + soft checkbox. */
export const resolveLoginFormStyles = (tokens: ThemeTokens) => ({
  container: {
    width: '100%' as const,
    gap: tokens.spacing.md,
  },
  inputs: {
    gap: tokens.spacing.lg,
  },
  optionsRow: {
    ...tokens.layout.presets.row,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: tokens.spacing.xs,
  },
  rememberRow: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: tokens.layout.borderWidth.md,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
    ...tokens.layout.presets.center,
  },
  forgotLink: {
    color: tokens.colors.primary,
    fontWeight: '600' as const,
  },
});
