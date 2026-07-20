import React, {useMemo} from 'react';
import {Alert, Pressable, Switch, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import DeliveryMap from '@molecules/maps/DeliveryMap';
import DriverBackgroundPermissionCard from '@molecules/delivery/DriverBackgroundPermissionCard';
import LiveTrackingCard from '@molecules/delivery/LiveTrackingCard';
import LocationPermissionGate from '@molecules/maps/LocationPermissionGate';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {formatCurrency} from '@helpers/locationHelpers';
import {
  setDriverAvailable,
  setDriverMode,
} from '@redux/slices/deliverySlice';
import {
  acceptDeliveryJobOnServer,
  updateDeliveryStatusOnServer,
} from '@services/deliveryServices/deliveryOrderService';
import {useLiveDeliveryTracking} from '@hooks/useLiveDeliveryTracking';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDeliveryDriverStyles} from './styles/resolveDeliveryDriverStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'DeliveryDriver'>};

const DeliveryDriver = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveDeliveryDriverStyles);
  const {orders, driverMode, driverAvailable, activeDriverOrderId} = useAppSelector(
    state => state.delivery,
  );
  const activeOrder = orders.find(o => o.id === activeDriverOrderId);
  const openJobs = orders.filter(o => o.status === 'pending');
  const canAcceptJobs = driverMode && driverAvailable && !activeDriverOrderId;
  const tracking = useLiveDeliveryTracking(activeOrder, 'driver');

  const driverMarkers = useMemo(() => {
    if (!activeOrder) {
      return [];
    }
    return [
      {
        id: 'pickup',
        coordinate: activeOrder.pickup.coordinate,
        title: activeOrder.pickup.label,
        pinColor: colors.success,
      },
      {
        id: 'dropoff',
        coordinate: activeOrder.dropoff.coordinate,
        title: activeOrder.dropoff.label,
        pinColor: colors.error,
      },
    ];
  }, [activeOrder, colors.error, colors.success]);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.driverPanel')} navigation={navigation} />
      <Card>
        <View style={styles.switchRow}>
          <TextView text={t('delivery.driverMode')} variant="h3" />
          <Switch
            value={driverMode}
            onValueChange={value => {
              dispatch(setDriverMode(value));
            }}
          />
        </View>
        {driverMode ? (
          <>
            <Spacer size="sm" />
            <View style={styles.switchRow}>
              <TextView text={t('delivery.availableForJobs')} variant="bodySmall" />
              <Switch
                value={driverAvailable}
                onValueChange={value => {
                  dispatch(setDriverAvailable(value));
                }}
              />
            </View>
          </>
        ) : null}
      </Card>
      <Spacer size="md" />
      <DriverBackgroundPermissionCard visible={driverMode && !!activeOrder} />
      <Spacer size="md" />
      {activeOrder ? (
        <>
          <TextView text={t('delivery.activeJob')} variant="h3" />
          <Spacer size="sm" />
          <LocationPermissionGate>
            <DeliveryMap
              height={sizes.mapPreview}
              markers={driverMarkers}
              driverPosition={activeOrder.driver?.coordinate}
              routeFrom={activeOrder.pickup.coordinate}
              routeTo={activeOrder.dropoff.coordinate}
              followDriver={isLiveTrackingStatus(activeOrder.status)}
              live={tracking.isLive}
            />
          </LocationPermissionGate>
          <Spacer size="sm" />
          <LiveTrackingCard
            order={activeOrder}
            progress={tracking.progress}
            isLive={tracking.isLive}
            lastUpdatedAt={tracking.lastUpdatedAt}
            role="driver"
            isBackgroundTracking={tracking.isBackgroundTracking}
          />
          <Spacer size="sm" />
          <Card>
            <TextView text={`${activeOrder.pickup.label} → ${activeOrder.dropoff.label}`} />
            <TextView text={formatCurrency(activeOrder.price)} variant="h3" />
            <Spacer size="sm" />
            {activeOrder.status === 'accepted' ? (
              <Button
                label={t('delivery.markPickedUp')}
                onPress={() => {
                  void updateDeliveryStatusOnServer(
                    dispatch,
                    activeOrder.id,
                    'picked_up',
                    'Picked up',
                  ).catch(() => Alert.alert(t('delivery.errorTitle'), t('delivery.statusUpdateFailed')));
                }}
              />
            ) : null}
            {activeOrder.status === 'picked_up' ? (
              <Button
                label={t('delivery.startDelivery')}
                onPress={() => {
                  void updateDeliveryStatusOnServer(
                    dispatch,
                    activeOrder.id,
                    'in_transit',
                    'On the way',
                  ).catch(() => Alert.alert(t('delivery.errorTitle'), t('delivery.statusUpdateFailed')));
                }}
              />
            ) : null}
            {activeOrder.status === 'in_transit' ? (
              <Button
                label={t('delivery.markDelivered')}
                onPress={() => {
                  void updateDeliveryStatusOnServer(
                    dispatch,
                    activeOrder.id,
                    'delivered',
                    'Delivered',
                  ).catch(() => Alert.alert(t('delivery.errorTitle'), t('delivery.statusUpdateFailed')));
                }}
              />
            ) : null}
            <Button
              label={t('delivery.openLiveMap')}
              variant="secondary"
              onPress={() =>
                navigation.navigate('LiveDeliveryMap', {
                  orderId: activeOrder.id,
                  mode: 'driver',
                })
              }
            />
          </Card>
        </>
      ) : null}
      <Spacer size="md" />
      <TextView text={t('delivery.openJobs')} variant="h3" />
      <Spacer size="sm" />
      {!driverMode || !driverAvailable ? (
        <TextView text={t('delivery.enableDriverHint')} muted />
      ) : activeDriverOrderId ? (
        <TextView text={t('delivery.finishActiveJobHint')} muted />
      ) : openJobs.length === 0 ? (
        <TextView text={t('delivery.noOpenJobs')} muted />
      ) : (
        <FlashList
          data={openJobs}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable
              disabled={!canAcceptJobs}
              onPress={() => {
                if (!canAcceptJobs) {
                  return;
                }
                void acceptDeliveryJobOnServer(dispatch, item.id)
                  .then(() => Alert.alert(t('delivery.jobAcceptedTitle'), t('delivery.jobAcceptedBody')))
                  .catch(() => Alert.alert(t('delivery.errorTitle'), t('delivery.acceptJobFailed')));
              }}>
              <Card style={styles.jobCard}>
                <TextView text={`${item.pickup.label} → ${item.dropoff.label}`} variant="bodySmall" />
                <TextView text={formatCurrency(item.price)} variant="h3" />
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default DeliveryDriver;
