import type {ThemeTokens} from '@theme/types';

export const resolveDSLoginOptionsTemplateStyles = (tokens: ThemeTokens) => ({
    hero: {
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      alignItems: 'center' as const,
    },
    grid: {
      flexDirection: tokens.layout.flexDirection.row,
      flexWrap: tokens.layout.flexWrap.wrap,
      gap: tokens.spacing.sm,
      width: '100%' as const,
    },
    footer: {width: '100%' as const, maxWidth: 400, gap: tokens.spacing.sm},
  });
