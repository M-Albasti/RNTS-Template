import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import DeliveryTimeline from '@molecules/delivery/DeliveryTimeline';
import OrderStatusBadge from '@molecules/delivery/OrderStatusBadge';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'DeliveryDetail'>;
  route: AppRouteProp<'DeliveryDetail'>;
};

const DeliveryDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const order = useAppSelector(state =>
    state.delivery.orders.find(o => o.id === route.params.orderId),
  );

  if (!order) {
    return (
      <ScreenContainer centered>
        <TextView text={t('delivery.orderNotFound')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.orderDetail')} onBack={() => navigation.goBack()} />
      <Card>
        <OrderStatusBadge label={t(`delivery.status.${order.status}`)} />
        <Spacer size="sm" />
        <TextView text={t('delivery.pickup')} variant="h3" />
        <TextView text={order.pickup.addressLine} variant="bodySmall" />
        <Spacer size="sm" />
        <TextView text={t('delivery.dropoff')} variant="h3" />
        <TextView text={order.dropoff.addressLine} variant="bodySmall" />
        <Spacer size="sm" />
        <TextView text={t(`delivery.package.${order.packageType}`)} variant="bodySmall" />
        {order.notes ? <TextView text={order.notes} variant="caption" muted /> : null}
        <Spacer size="sm" />
        <TextView text={formatCurrency(order.price)} variant="h3" />
      </Card>
      <Spacer size="md" />
      <TextView text={t('delivery.timeline')} variant="h3" />
      <Spacer size="sm" />
      <DeliveryTimeline events={order.timeline} />
    </ScreenContainer>
  );
};

export default DeliveryDetail;
