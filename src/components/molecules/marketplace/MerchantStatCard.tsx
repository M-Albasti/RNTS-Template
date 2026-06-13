import React from 'react';
import {View} from 'react-native';

import Card from '@atoms/Card';
import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';

type MerchantStatCardProps = {
  label: string;
  value: string;
  accent?: string;
};

const MerchantStatCard = ({label, value, accent}: MerchantStatCardProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    card: {flex: 1, minWidth: '46%' as const, gap: tokens.spacing.xs},
    value: {color: accent ?? tokens.colors.primary},
  }));

  return (
    <Card style={styles.card}>
      <TextView text={value} variant="h3" style={styles.value} />
      <TextView text={label} variant="caption" muted />
    </Card>
  );
};

export default MerchantStatCard;
