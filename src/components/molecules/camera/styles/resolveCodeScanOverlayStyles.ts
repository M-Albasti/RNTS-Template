import type {ThemeTokens} from '@theme/types';

export const resolveCodeScanOverlayStyles = (tokens: ThemeTokens) => ({
    backdrop: {
      ...tokens.layout.presets.absoluteFill,
      ...tokens.layout.presets.center,
      backgroundColor: tokens.colors.overlay,
      padding: tokens.spacing.lg,
    },
    card: {
      width: '100%' as const,
      gap: tokens.spacing.sm,
    },
    actions: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    action: {flex: tokens.layout.flex.fill},
  });
