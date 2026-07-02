import type {ThemeTokens} from '@theme/types';

type OrderStatusTone = 'default' | 'success' | 'warning' | 'danger';

export const resolveOrderStatusBadgeStyles = (
  tokens: ThemeTokens,
  tone: OrderStatusTone,
) => {
  const colors = {
    default: tokens.colors.primary,
    success: tokens.colors.success ?? '#22C55E',
    warning: tokens.colors.warning ?? '#F59E0B',
    danger: tokens.colors.error ?? '#EF4444',
  };

  return {
    badge: {
      alignSelf: 'flex-start' as const,
      backgroundColor: `${colors[tone]}22`,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs ?? 4,
    },
    text: {color: colors[tone]},
  };
};
