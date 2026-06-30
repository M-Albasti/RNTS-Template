import type {ThemeTokens} from '@theme/types';

import type {MerchantStore} from '@Types/marketplaceTypes';

export const resolveMerchantHubStyles = (
  tokens: ThemeTokens,
  merchantStore: MerchantStore,
) => ({
  hero: {
    backgroundColor: tokens.colors.surfaceSecondary,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  stats: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
  openBadge: {
    alignSelf: 'flex-start' as const,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    backgroundColor: merchantStore.isOpen
      ? tokens.colors.successMuted
      : tokens.colors.surfaceSecondary,
  },
  section: {gap: tokens.spacing.sm},
  alertCard: {gap: tokens.spacing.xs, marginBottom: tokens.spacing.xs},
});
