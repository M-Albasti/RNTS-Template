import type {ThemeTokens} from '@theme/types';

export const resolveCameraHubStyles = (tokens: ThemeTokens) => ({
    hero: {
      ...tokens.layout.presets.columnCenter,
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    empty: {
      ...tokens.layout.presets.columnCenter,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.sm,
    },
  });
