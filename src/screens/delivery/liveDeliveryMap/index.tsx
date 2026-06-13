import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import DeliveryMap from '@molecules/maps/DeliveryMap';
import LiveTrackingCard from '@molecules/delivery/LiveTrackingCard';
import LocationPermissionGate from '@molecules/maps/LocationPermissionGate';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';

import {isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {useLiveDeliveryTracking} from '@hooks/useLiveDeliveryTracking';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'LiveDeliveryMap'>;
  route: AppRouteProp<'LiveDeliveryMap'>;
};

const LiveDeliveryMap = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {orderId, mode} = route.params;
  const isFocused = useIsFocused();
  const {colors, spacing} = useThemeTokens();
  const order = useAppSelector(state => state.delivery.orders.find(o => o.id === orderId));
  const tracking = useLiveDeliveryTracking(order, mode, {
    pollEnabled: mode === 'customer' ? isFocused : false,
  });
  const styles = useThemedStyles(tokens => ({
    root: {flex: tokens.layout.flex.fill, backgroundColor: tokens.colors.cameraBackground},
    header: {
      position: tokens.layout.position.absolute,
      top: 0,
      left: 0,
      right: 0,
      zIndex: tokens.layout.zIndex.overlay,
      paddingHorizontal: tokens.spacing.md,
    },
    footer: {
      position: tokens.layout.position.absolute,
      bottom: 0,
      left: 0,
      right: 0,
      padding: tokens.spacing.md,
    },
    empty: {
      flex: tokens.layout.flex.fill,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }));

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
      <View style={styles.empty}>
        <TextView text={t('delivery.orderNotFound')} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + spacing.sm}]}>
        <ScreenHeader
          title={
            mode === 'driver' ? t('delivery.driverLiveMap') : t('delivery.customerLiveMap')
          }
          onBack={() => navigation.goBack()}
        />
      </View>
      <LocationPermissionGate>
        <DeliveryMap
          fullScreen
          markers={markers}
          routeFrom={order.pickup.coordinate}
          routeTo={order.dropoff.coordinate}
          driverPosition={order.driver?.coordinate}
          followDriver={isLiveTrackingStatus(order.status)}
          live={tracking.isLive}
        />
      </LocationPermissionGate>
      <View style={[styles.footer, {paddingBottom: insets.bottom + spacing.lg}]}>
        <LiveTrackingCard
          order={order}
          progress={tracking.progress}
          isLive={tracking.isLive}
          lastUpdatedAt={tracking.lastUpdatedAt}
          role={mode}
          isBackgroundTracking={tracking.isBackgroundTracking}
        />
      </View>
    </View>
  );
};

export default LiveDeliveryMap;
