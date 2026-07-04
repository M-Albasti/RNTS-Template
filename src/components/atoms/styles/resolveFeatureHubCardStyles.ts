import type {ThemeTokens} from '@theme/types';

export const resolveFeatureHubCardStyles = (tokens: ThemeTokens, accentColor?: string) => ({
    card: {
      flex: tokens.layout.flex.fill,
      minWidth: '46%' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    cardPressed: {
      backgroundColor: tokens.colors.surfaceSecondary,
      ...tokens.shadows.none,
    },
    iconWrap: {
      width: tokens.sizes.touchTarget,
      height: tokens.sizes.touchTarget,
      borderRadius: tokens.radius.md,
      ...tokens.layout.presets.center,
      backgroundColor: accentColor || tokens.colors.primaryMuted,
      marginBottom: tokens.spacing.sm,
    },
  });
