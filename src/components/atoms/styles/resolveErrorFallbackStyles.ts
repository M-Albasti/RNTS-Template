import type {ThemeTokens} from '@theme/types';

export const resolveErrorFallbackStyles = (tokens: ThemeTokens) => ({
      container: {
        flex: tokens.layout.flex.fill,
        justifyContent: 'center',
        alignItems: 'center',
        padding: tokens.spacing.xl,
        backgroundColor: tokens.colors.background,
      },
      errorText: {
        color: tokens.colors.error,
      },
    });
