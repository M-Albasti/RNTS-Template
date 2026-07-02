import type {ThemeTokens} from '@theme/types';

export const resolveDrawerMenuContentStyles = (tokens: ThemeTokens) => ({
      container: {
        flex: tokens.layout.flex.fill,
        paddingTop: tokens.spacing.xxl,
        paddingHorizontal: tokens.spacing.lg,
        backgroundColor: tokens.colors.background,
      },
      footer: {
        marginTop: 'auto' as const,
        paddingBottom: tokens.spacing.xl,
        gap: tokens.spacing.sm,
      },
    });
