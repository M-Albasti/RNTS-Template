import type {ThemeTokens} from '@theme/types';

export const resolveDSAudioPlayerTemplateStyles = (tokens: ThemeTokens) => ({
    playerCard: {
      flex: tokens.layout.flex.fill,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      paddingVertical: tokens.spacing.lg,
      minHeight: tokens.sizes.audioPlayerMin,
      ...tokens.shadows.md,
    },
  });
