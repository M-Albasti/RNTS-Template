import type {ThemeTokens} from '@theme/types';

export const resolveAudioRecordingStyles = (tokens: ThemeTokens) => ({
    recordAudioContainer: {
      ...tokens.layout.presets.columnCenter,
      paddingTop: tokens.spacing.xl,
    },
    headerTextStyle: {
      ...tokens.typography.title,
      color: tokens.colors.textPrimary,
    },
    buttonContainerStyle: {
      padding: tokens.spacing.md,
      margin: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderRadius: tokens.radius.lg,
      borderColor: tokens.colors.border,
      ...tokens.layout.presets.center,
      width: tokens.sizes.videoPreview,
    },
  });
