import type {ThemeTokens} from '@theme/types';

export const resolveLoginTemplateStyles = (tokens: ThemeTokens) => ({
  hero: {
    alignItems: 'center' as const,
    marginBottom: tokens.spacing.lg,
  },
  logo: {
    width: tokens.sizes.avatarLg,
    height: tokens.sizes.avatarLg,
    borderRadius: tokens.radius.xl,
    backgroundColor: tokens.colors.primaryMuted,
    ...tokens.layout.presets.center,
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.md,
  },
  formCard: {
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    ...tokens.shadows.md,
  },
});
