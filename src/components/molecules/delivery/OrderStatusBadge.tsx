import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveOrderStatusBadgeStyles} from './styles/resolveOrderStatusBadgeStyles';

type OrderStatusBadgeProps = {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

const OrderStatusBadge = ({
  label,
  tone = 'default',
}: OrderStatusBadgeProps): React.JSX.Element => {
  const styles = useThemedStyles(
    tokens => resolveOrderStatusBadgeStyles(tokens, tone),
    [tone],
  );

  return (
    <View style={styles.badge}>
      <TextView text={label} variant="caption" style={styles.text} />
    </View>
  );
};

export default OrderStatusBadge;
