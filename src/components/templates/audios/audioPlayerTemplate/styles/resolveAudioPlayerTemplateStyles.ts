import type {ThemeTokens} from '@theme/types';

export const resolveAudioPlayerTemplateStyles = (tokens: ThemeTokens) => ({
    playerCard: {
      flex: tokens.layout.flex.fill,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      paddingVertical: tokens.spacing.lg,
      ...tokens.shadows.md,
    },
  });
