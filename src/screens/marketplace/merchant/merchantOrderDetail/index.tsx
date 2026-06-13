import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {
  getMerchantOrderItems,
  getMerchantOrderTotal,
  getMerchantOrders,
  getNextMerchantOrderStatus,
} from '@helpers/marketplaceHelpers';
import {updateMarketplaceOrderStatus} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'MerchantOrderDetail'>;
  route: AppRouteProp<'MerchantOrderDetail'>;
};

const MerchantOrderDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens => ({
    cancelWrap: {marginTop: tokens.spacing.md},
  }));
  const orders = useAppSelector(state => state.marketplace.orders);
  const order = getMerchantOrders(orders).find(o => o.id === route.params.orderId);

  if (!order) {
    return (
      <ScreenContainer centered>
        <TextView text={t('marketplace.orderNotFound')} />
      </ScreenContainer>
    );
  }

  const items = getMerchantOrderItems(order);
  const nextStatus = getNextMerchantOrderStatus(order.status);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('marketplace.merchant.orderDetail')}
        onBack={() => navigation.goBack()}
      />
      <Card>
        <TextView text={`#${order.id}`} variant="caption" muted />
        <TextView text={t(`marketplace.status.${order.status}`)} variant="h3" />
        <TextView text={order.addressLine} variant="bodySmall" muted />
        <Spacer size="sm" />
        {items.map(item => (
          <TextView
            key={item.productId}
            text={`${item.title} × ${item.quantity} — ${formatCurrency(item.unitPrice * item.quantity)}`}
            variant="bodySmall"
          />
        ))}
        <Spacer size="sm" />
        <TextView
          text={t('marketplace.merchant.orderTotal', {
            amount: formatCurrency(getMerchantOrderTotal(order)),
          })}
          variant="h3"
        />
      </Card>
      <Spacer size="lg" />
      {nextStatus ? (
        <Button
          label={t('marketplace.merchant.advanceTo', {
            status: t(`marketplace.status.${nextStatus}`),
          })}
          fullWidth
          onPress={() =>
            dispatch(updateMarketplaceOrderStatus({orderId: order.id, status: nextStatus}))
          }
        />
      ) : null}
      {order.status !== 'cancelled' && order.status !== 'delivered' ? (
        <View style={styles.cancelWrap}>
          <Button
            label={t('marketplace.merchant.cancelOrder')}
            variant="danger"
            fullWidth
            onPress={() =>
              dispatch(updateMarketplaceOrderStatus({orderId: order.id, status: 'cancelled'}))
            }
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
};

export default MerchantOrderDetail;
