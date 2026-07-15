import type {ThemeTokens} from '@theme/types';

export const resolveFeatureHubCardStyles = (tokens: ThemeTokens, accentColor?: string) => ({
  card: {
    flex: tokens.layout.flex.fill,
    minWidth: '46%' as const,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: accentColor || tokens.colors.primary,
    ...tokens.shadows.md,
  },
  cardPressed: {
    backgroundColor: tokens.colors.surfaceSecondary,
    ...tokens.shadows.none,
  },
  iconWrap: {
    width: tokens.sizes.touchTarget,
    height: tokens.sizes.touchTarget,
    borderRadius: tokens.radius.lg,
    ...tokens.layout.presets.center,
    backgroundColor: accentColor || tokens.colors.primaryMuted,
    marginBottom: tokens.spacing.sm,
  },
});
