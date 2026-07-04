import type {ThemeTokens} from '@theme/types';

export const resolveLoginOptionsTemplateStyles = (tokens: ThemeTokens) => ({
      hero: {
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        alignItems: 'center',
      },
      grid: {
        flexDirection: tokens.layout.flexDirection.row,
        flexWrap: tokens.layout.flexWrap.wrap,
        gap: tokens.spacing.sm,
        width: '100%',
      },
      footer: {
        width: '100%',
        maxWidth: 400,
        gap: tokens.spacing.sm,
      },
    });
