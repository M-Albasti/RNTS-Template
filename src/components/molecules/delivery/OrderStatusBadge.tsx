import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

type OrderStatusBadgeProps = {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

const OrderStatusBadge = ({
  label,
  tone = 'default',
}: OrderStatusBadgeProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens => {
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
  });

  return (
    <View style={styles.badge}>
      <TextView text={label} variant="caption" style={styles.text} />
    </View>
  );
};

export default OrderStatusBadge;
