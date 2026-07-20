import React from 'react';
import {View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {MARKETPLACE_DELIVERY_FEE} from '@constants/marketplaceMockData';
import {formatCurrency} from '@helpers/locationHelpers';
import {getCartLines, getCartSubtotal} from '@helpers/marketplaceHelpers';
import {removeFromCart, updateCartQuantity} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMarketplaceCartStyles} from './styles/resolveMarketplaceCartStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceCart'>};

const MarketplaceCart = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveMarketplaceCartStyles);
  const {cart, products, promotions} = useAppSelector(state => state.marketplace);
  const lines = getCartLines(cart, products, promotions);
  const subtotal = getCartSubtotal(cart, products, promotions);
  const total = subtotal + (lines.length ? MARKETPLACE_DELIVERY_FEE : 0);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.cart')} navigation={navigation} />
      {lines.length === 0 ? (
        <TextView text={t('marketplace.emptyCart')} align="center" muted />
      ) : (
        <>
          <FlashList
            data={lines}
            keyExtractor={item => item.product.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <Card style={styles.card}>
                <TextView text={`${item.product.imageEmoji} ${item.product.title}`} variant="bodySmall" />
                <View style={styles.row}>
                  <View style={styles.qtyRow}>
                    <Button
                      label="-"
                      variant="ghost"
                      onPress={() =>
                        dispatch(
                          updateCartQuantity({
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                    />
                    <TextView text={String(item.quantity)} />
                    <Button
                      label="+"
                      variant="ghost"
                      onPress={() =>
                        dispatch(
                          updateCartQuantity({
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                    />
                  </View>
                  <TextView text={formatCurrency(item.lineTotal, item.product.currency)} />
                </View>
                <Button
                  label={t('common.delete')}
                  variant="danger"
                  onPress={() => dispatch(removeFromCart(item.product.id))}
                />
              </Card>
            )}
          />
          <Spacer size="md" />
          <Card>
            <TextView text={t('marketplace.subtotal', {amount: formatCurrency(subtotal)})} />
            <TextView
              text={t('marketplace.deliveryFee', {amount: formatCurrency(MARKETPLACE_DELIVERY_FEE)})}
              variant="bodySmall"
              muted
            />
            <Spacer size="sm" />
            <TextView text={t('marketplace.total', {amount: formatCurrency(total)})} variant="h3" />
          </Card>
          <Spacer size="lg" />
          <Button
            label={t('marketplace.checkout')}
            fullWidth
            onPress={() => navigation.navigate('MarketplaceCheckout')}
          />
        </>
      )}
    </ScreenContainer>
  );
};

export default MarketplaceCart;
