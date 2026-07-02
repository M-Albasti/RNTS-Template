import type {ThemeTokens} from '@theme/types';

export const resolveAudioPlayerViewStyles = (tokens: ThemeTokens) => ({
        container: {
          flex: tokens.layout.flex.fill,
          justifyContent: 'space-between',
        },
        errorBanner: {
          marginHorizontal: tokens.spacing.lg,
          marginBottom: tokens.spacing.md,
          padding: tokens.spacing.md,
          borderRadius: tokens.radius.md,
          backgroundColor: tokens.colors.errorMuted,
        },
      });
