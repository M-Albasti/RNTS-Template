import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import OrderStatusBadge from '@molecules/delivery/OrderStatusBadge';
import Rating from '@atoms/Rating';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {submitCustomerReview, updateMarketplaceOrderStatus} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'MarketplaceOrderDetail'>;
  route: AppRouteProp<'MarketplaceOrderDetail'>;
};

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const;

const MarketplaceOrderDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const order = useAppSelector(state =>
    state.marketplace.orders.find(o => o.id === route.params.orderId),
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!order) {
    return (
      <ScreenContainer centered>
        <TextView text={t('marketplace.orderNotFound')} />
      </ScreenContainer>
    );
  }

  const advanceStatus = () => {
    const idx = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
    dispatch(updateMarketplaceOrderStatus({orderId: order.id, status: next}));
  };

  const submitReview = () => {
    dispatch(submitCustomerReview({orderId: order.id, rating, comment}));
    Alert.alert(t('marketplace.rateOrderTitle'), t('marketplace.rateOrderBody'));
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.orderDetail')} navigation={navigation} />
      <Card>
        <OrderStatusBadge label={t(`marketplace.status.${order.status}`)} />
        <Spacer size="sm" />
        {order.items.map(item => (
          <TextView
            key={item.productId}
            text={`${item.title} × ${item.quantity} — ${formatCurrency(item.unitPrice * item.quantity)}`}
            variant="bodySmall"
          />
        ))}
        <Spacer size="sm" />
        <TextView text={order.addressLine} variant="caption" muted />
        <TextView text={t(`marketplace.payment.${order.paymentMethod}`)} variant="caption" muted />
        <Spacer size="sm" />
        <TextView text={formatCurrency(order.total)} variant="h3" />
      </Card>
      {order.status !== 'delivered' && order.status !== 'cancelled' ? (
        <>
          <Spacer size="lg" />
          <Button label={t('marketplace.advanceStatus')} onPress={advanceStatus} fullWidth />
        </>
      ) : null}
      {order.status === 'delivered' && !order.customerRating ? (
        <>
          <Spacer size="lg" />
          <Card>
            <TextView text={t('marketplace.rateOrderPrompt')} variant="h3" />
            <Spacer size="sm" />
            <Rating value={rating} interactive onChange={setRating} size={28} />
            <Spacer size="sm" />
            <TextInputView
              label={t('marketplace.rateOrderComment')}
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <Spacer size="sm" />
            <Button label={t('marketplace.submitReview')} fullWidth onPress={submitReview} />
          </Card>
        </>
      ) : null}
      {order.customerRating ? (
        <>
          <Spacer size="lg" />
          <Card>
            <TextView text={t('marketplace.yourRating')} variant="bodySmall" muted />
            <Rating value={order.customerRating} showValue size={18} />
            {order.customerReview ? (
              <TextView text={order.customerReview} variant="bodySmall" />
            ) : null}
          </Card>
        </>
      ) : null}
    </ScreenContainer>
  );
};

export default MarketplaceOrderDetail;
