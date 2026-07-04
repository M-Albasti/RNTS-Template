import type {ThemeTokens} from '@theme/types';

export const resolveCameraPermissionGateStyles = (tokens: ThemeTokens) => ({
    gate: {
      ...tokens.layout.presets.center,
      ...tokens.layout.presets.fill,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
      backgroundColor: tokens.colors.background,
    },
  });
