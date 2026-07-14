import type {ThemeTokens} from '@theme/types';

export const resolveCameraHubStyles = (tokens: ThemeTokens) => ({
  hero: {
    ...tokens.layout.presets.columnCenter,
    backgroundColor: tokens.colors.primaryMuted,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.primary,
    ...tokens.shadows.sm,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  empty: {
    ...tokens.layout.presets.columnCenter,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
});
