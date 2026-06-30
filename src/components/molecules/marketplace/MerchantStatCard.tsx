import React from 'react';
import {View} from 'react-native';

import Card from '@atoms/Card';
import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMerchantStatCardStyles} from './styles/resolveMerchantStatCardStyles';

type MerchantStatCardProps = {
  label: string;
  value: string;
  accent?: string;
};

const MerchantStatCard = ({label, value, accent}: MerchantStatCardProps): React.JSX.Element => {
  const styles = useThemedStyles(
    tokens => resolveMerchantStatCardStyles(tokens, accent),
    [accent],
  );

  return (
    <Card style={styles.card}>
      <TextView text={value} variant="h3" style={styles.value} />
      <TextView text={label} variant="caption" muted />
    </Card>
  );
};

export default MerchantStatCard;
