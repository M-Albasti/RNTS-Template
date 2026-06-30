import type {ThemeTokens} from '@theme/types';

export const resolveMerchantStatCardStyles = (
  tokens: ThemeTokens,
  accent?: string,
) => ({
  card: {flex: 1, minWidth: '46%' as const, gap: tokens.spacing.xs},
  value: {color: accent ?? tokens.colors.primary},
});
