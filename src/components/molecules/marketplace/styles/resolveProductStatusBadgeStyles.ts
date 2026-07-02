import type {ThemeTokens} from '@theme/types';

type ProductAvailabilityStatus = 'disabled' | 'in_stock' | 'out_of_stock';

export const resolveProductStatusBadgeStyles = (
  tokens: ThemeTokens,
  status: ProductAvailabilityStatus,
) => ({
  pill: {
    alignSelf: 'flex-start' as const,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    backgroundColor:
      status === 'in_stock'
        ? tokens.colors.successMuted
        : status === 'out_of_stock'
          ? tokens.colors.surfaceSecondary
          : tokens.colors.surfaceSecondary,
  },
  text: {
    color:
      status === 'in_stock'
        ? tokens.colors.success
        : status === 'out_of_stock'
          ? tokens.colors.warning
          : tokens.colors.textMuted,
  },
});
