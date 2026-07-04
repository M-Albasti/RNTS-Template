import type {ThemeTokens} from '@theme/types';

export const resolveAudioSubmitStyles = (tokens: ThemeTokens) => ({
    buttonContainerStyle: {
      padding: tokens.spacing.md,
      margin: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderRadius: tokens.radius.lg,
      ...tokens.layout.presets.center,
      width: tokens.sizes.videoPreview,
    },
  });
