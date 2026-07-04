import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Rating from '@atoms/Rating';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {
  getEffectiveProductPrice,
  getPromotionForProduct,
  isProductBuyable,
} from '@helpers/marketplaceHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveProductCardStyles} from './styles/resolveProductCardStyles';
import {spacing} from '@theme/tokens/spacing';

import type {MarketplaceProduct} from '@Types/marketplaceTypes';

type ProductCardProps = {
  product: MarketplaceProduct;
  onPress: () => void;
  onAdd?: () => void;
};

const ProductCard = ({product, onPress, onAdd}: ProductCardProps): React.JSX.Element => {
  const {t} = useTranslation();
  const promotions = useAppSelector(state => state.marketplace.promotions);
  const effectivePrice = getEffectiveProductPrice(product, promotions);
  const promo = getPromotionForProduct(product.id, promotions);
  const buyable = isProductBuyable(product);

  const styles = useThemedStyles(
    tokens => resolveProductCardStyles(tokens, buyable),
    [buyable],
  );

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <TextView text={product.imageEmoji} style={styles.emoji} />
        <TextView text={product.title} variant="bodySmall" numberOfLines={2} />
        <Rating value={product.rating} reviewCount={product.reviewCount} size={14} />
        {promo ? (
          <View style={styles.promoPill}>
            <TextView text={t('marketplace.onSale')} variant="caption" />
          </View>
        ) : null}
        <View style={styles.row}>
          <View>
            {promo ? (
              <TextView
                text={formatCurrency(product.price, product.currency)}
                variant="caption"
                style={styles.strike}
              />
            ) : null}
            <TextView text={formatCurrency(effectivePrice, product.currency)} variant="h3" />
          </View>
          {onAdd && buyable ? (
            <Pressable style={styles.addBtn} onPress={onAdd} hitSlop={spacing.sm}>
              <TextView text="+" style={styles.addText} />
            </Pressable>
          ) : null}
        </View>
        {!buyable ? (
          <TextView
            text={
              !product.isEnabled
                ? t('marketplace.unavailable')
                : t('marketplace.outOfStock')
            }
            variant="caption"
            muted
          />
        ) : null}
      </Card>
    </Pressable>
  );
};

export default ProductCard;
