import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import TextView from '@atoms/TextView';
import {getProductAvailabilityLabel} from '@helpers/marketplaceHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';

import type {MarketplaceProduct} from '@Types/marketplaceTypes';

type ProductStatusBadgeProps = {
  product: MarketplaceProduct;
};

const ProductStatusBadge = ({product}: ProductStatusBadgeProps): React.JSX.Element => {
  const {t} = useTranslation();
  const status = getProductAvailabilityLabel(product);
  const styles = useThemedStyles(tokens => ({
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
  }));

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
