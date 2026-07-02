import type {ThemeTokens} from '@theme/types';

import type {MerchantPromotion} from '@Types/marketplaceTypes';

export const resolvePromotionCardStyles = (
  tokens: ThemeTokens,
  promotion: MerchantPromotion,
) => ({
  card: {gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm},
  row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
  activePill: {
    backgroundColor: promotion.isActive
      ? tokens.colors.successMuted
      : tokens.colors.surfaceSecondary,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
  },
  actions: {flexDirection: 'row' as const, gap: tokens.spacing.sm, flexWrap: 'wrap' as const},
});
