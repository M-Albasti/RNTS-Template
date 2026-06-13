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

  const styles = useThemedStyles(tokens => ({
    card: {
      width: '48%' as const,
      minWidth: tokens.sizes.minCardWidth,
      gap: tokens.spacing.xs,
      opacity: buyable ? 1 : 0.65,
    },
    emoji: {
      ...tokens.typography.display,
      textAlign: tokens.layout.textAlign.center,
      marginBottom: tokens.spacing.xs,
    },
    row: {...tokens.layout.presets.rowBetween, alignItems: tokens.layout.alignItems.center},
    addBtn: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.full,
      width: tokens.sizes.addButton,
      height: tokens.sizes.addButton,
      ...tokens.layout.presets.center,
    },
    addText: {
      color: tokens.colors.textInverse,
      ...tokens.typography.h3,
    },
    promoPill: {
      alignSelf: tokens.layout.alignSelf.start,
      backgroundColor: tokens.colors.warningMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: tokens.spacing.xxs,
    },
    strike: {textDecorationLine: 'line-through' as const, color: tokens.colors.textMuted},
  }));

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
