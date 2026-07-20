import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Rating from '@atoms/Rating';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {
  getEffectiveProductPrice,
  getPromotionForProduct,
  isProductBuyable,
} from '@helpers/marketplaceHelpers';
import {addToCart} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMarketplaceProductDetailStyles} from './styles/resolveMarketplaceProductDetailStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'MarketplaceProductDetail'>;
  route: AppRouteProp<'MarketplaceProductDetail'>;
};

const MarketplaceProductDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {products, promotions} = useAppSelector(state => state.marketplace);
  const product = products.find(p => p.id === route.params.productId);
  const [qty, setQty] = useState(1);

  const styles = useThemedStyles(resolveMarketplaceProductDetailStyles);

  if (!product) {
    return (
      <ScreenContainer centered>
        <TextView text={t('marketplace.productNotFound')} />
      </ScreenContainer>
    );
  }

  const effectivePrice = getEffectiveProductPrice(product, promotions);
  const promo = getPromotionForProduct(product.id, promotions);
  const buyable = isProductBuyable(product);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={product.title} navigation={navigation} />
      <Card>
        <TextView text={product.imageEmoji} variant="h3" align="center" />
        <Spacer size="sm" />
        <Heading text={product.title} level="h2" />
        <TextView text={product.description} variant="bodySmall" muted />
        <Spacer size="sm" />
        <TextView text={product.sellerName} variant="caption" />
        <Rating value={product.rating} reviewCount={product.reviewCount} showValue size={16} />
        <Spacer size="md" />
        {promo ? (
          <>
            <TextView
              text={formatCurrency(product.price, product.currency)}
              variant="bodySmall"
              style={styles.strike}
            />
            <Heading text={formatCurrency(effectivePrice, product.currency)} level="h1" />
            <TextView text={promo.title} variant="caption" muted />
          </>
        ) : (
          <Heading text={formatCurrency(product.price, product.currency)} level="h1" />
        )}
        <TextView text={t('marketplace.stockLeft', {count: product.stock})} variant="caption" muted />
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
      <Spacer size="lg" />
      {buyable ? (
        <>
          <View style={styles.qtyRow}>
            <Button label="-" variant="secondary" onPress={() => setQty(q => Math.max(1, q - 1))} />
            <TextView text={String(qty)} variant="h3" />
            <Button
              label="+"
              variant="secondary"
              onPress={() => setQty(q => Math.min(product.stock, q + 1))}
            />
          </View>
          <Spacer size="lg" />
          <Button
            label={t('marketplace.addToCart')}
            fullWidth
            onPress={() => {
              dispatch(addToCart({productId: product.id, quantity: qty}));
              Alert.alert(t('marketplace.addedTitle'), t('marketplace.addedBody'));
            }}
          />
          <Button
            label={t('marketplace.buyNow')}
            variant="secondary"
            fullWidth
            onPress={() => {
              dispatch(addToCart({productId: product.id, quantity: qty}));
              navigation.navigate('MarketplaceCart');
            }}
          />
        </>
      ) : null}
    </ScreenContainer>
  );
};

export default MarketplaceProductDetail;
