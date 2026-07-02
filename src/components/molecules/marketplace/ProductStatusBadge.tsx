import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextView from '@atoms/TextView';
import {getProductAvailabilityLabel} from '@helpers/marketplaceHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveProductStatusBadgeStyles} from './styles/resolveProductStatusBadgeStyles';

import type {MarketplaceProduct} from '@Types/marketplaceTypes';

type ProductStatusBadgeProps = {
  product: MarketplaceProduct;
};

const ProductStatusBadge = ({product}: ProductStatusBadgeProps): React.JSX.Element => {
  const {t} = useTranslation();
  const status = getProductAvailabilityLabel(product);
  const styles = useThemedStyles(
    tokens => resolveProductStatusBadgeStyles(tokens, status),
    [status],
  );

  return (
    <View style={styles.pill}>
      <TextView
        text={t(`marketplace.merchant.status.${status}`)}
        variant="caption"
        style={styles.text}
      />
    </View>
  );
};

export default ProductStatusBadge;
