import React, {useMemo} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useIsFocused} from '@react-navigation/native';

import Button from '@atoms/Button';
import DeliveryMap from '@molecules/maps/DeliveryMap';
import DeliveryTimeline from '@molecules/delivery/DeliveryTimeline';
import LiveTrackingCard from '@molecules/delivery/LiveTrackingCard';
import LocationPermissionGate from '@molecules/maps/LocationPermissionGate';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {cancelDeliveryOrderOnServer} from '@services/deliveryServices/deliveryOrderService';
import {isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {useLiveDeliveryTracking} from '@hooks/useLiveDeliveryTracking';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'OrderTracking'>;
  route: AppRouteProp<'OrderTracking'>;
};

const OrderTracking = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {colors} = useThemeTokens();
  const order = useAppSelector(state =>
    state.delivery.orders.find(o => o.id === route.params.orderId),
  );
  const tracking = useLiveDeliveryTracking(order, 'customer', {pollEnabled: isFocused});

  const markers = useMemo(() => {
    if (!order) {
      return [];
    }
    return [
      {
        id: 'pickup',
        coordinate: order.pickup.coordinate,
        title: order.pickup.label,
        pinColor: colors.success,
      },
      {
        id: 'dropoff',
        coordinate: order.dropoff.coordinate,
        title: order.dropoff.label,
        pinColor: colors.error,
      },
    ];
  }, [colors.error, colors.success, order]);

  if (!order) {
    return (
      <ScreenContainer centered>
        <TextView text={t('delivery.orderNotFound')} />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.trackOrder')} navigation={navigation} />
      <LocationPermissionGate>
        <DeliveryMap
          height={340}
          markers={markers}
          routeFrom={order.pickup.coordinate}
          routeTo={order.dropoff.coordinate}
          driverPosition={order.driver?.coordinate}
          followDriver={isLiveTrackingStatus(order.status)}
          live={tracking.isLive}
        />
      </LocationPermissionGate>
      <Spacer size="md" />
      <LiveTrackingCard
        order={order}
        progress={tracking.progress}
        isLive={tracking.isLive}
        lastUpdatedAt={tracking.lastUpdatedAt}
        role="customer"
      />
      <Spacer size="md" />
      <Button
        label={t('delivery.openLiveMap')}
        fullWidth
        onPress={() =>
          navigation.navigate('LiveDeliveryMap', {orderId: order.id, mode: 'customer'})
        }
      />
      <Spacer size="md" />
      <DeliveryTimeline events={order.timeline} />
      <Spacer size="lg" />
      {order.status === 'pending' ? (
        <TextView text={t('delivery.status.pending')} align="center" muted />
      ) : null}
      {!['delivered', 'cancelled'].includes(order.status) ? (
        <Button
          label={t('delivery.cancelOrder')}
          variant="danger"
          fullWidth
          onPress={() => {
            void cancelDeliveryOrderOnServer(dispatch, order.id)
              .then(() => {
                Alert.alert(t('delivery.cancelledTitle'), t('delivery.cancelledBody'));
                navigation.goBack();
              })
              .catch(() => Alert.alert(t('delivery.errorTitle'), t('delivery.cancelOrderFailed')));
          }}
        />
      ) : null}
      <Button
        label={t('delivery.viewDetails')}
        variant="ghost"
        fullWidth
        onPress={() => navigation.navigate('DeliveryDetail', {orderId: order.id})}
      />
    </ScreenContainer>
  );
};

export default OrderTracking;
