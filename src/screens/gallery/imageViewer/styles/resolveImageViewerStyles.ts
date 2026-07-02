import type {ThemeTokens} from '@theme/types';

export const resolveImageViewerStyles = (tokens: ThemeTokens) => ({
    image: {
      width: '100%',
      height: tokens.sizes.videoPreviewLg,
      borderRadius: tokens.radius.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    actions: {gap: tokens.spacing.sm},
  });
