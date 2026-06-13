import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import TextView from '@atoms/TextView';

import {getRemainingEtaMinutes} from '@helpers/deliveryTrackingHelpers';
import {formatCurrency} from '@helpers/locationHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';

import type {DeliveryOrder} from '@Types/deliveryTypes';

type LiveTrackingCardProps = {
  order: DeliveryOrder;
  progress: number;
  isLive: boolean;
  lastUpdatedAt: number | null;
  role: 'customer' | 'driver';
  isBackgroundTracking?: boolean;
};

const LiveTrackingCard = ({
  order,
  progress,
  isLive,
  lastUpdatedAt,
  role,
  isBackgroundTracking = false,
}: LiveTrackingCardProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    card: {gap: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    livePill: {
      backgroundColor: tokens.colors.error,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
    liveText: {color: tokens.colors.textInverse},
    progressTrack: {
      height: tokens.sizes.progressTrack,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.border,
      overflow: tokens.layout.overflow.hidden,
    },
    progressFill: {
      height: tokens.sizes.progressTrack,
      backgroundColor: tokens.colors.primary,
    },
  }));

  const eta = getRemainingEtaMinutes(
    order.pickup.coordinate,
    order.dropoff.coordinate,
    order.driver?.coordinate,
    order.etaMinutes,
  );

  const updatedLabel =
    lastUpdatedAt !== null
      ? t('delivery.lastUpdated', {
          time: new Date(lastUpdatedAt).toLocaleTimeString(),
        })
      : t('delivery.waitingForLocation');

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <TextView
          text={
            role === 'driver'
              ? t('delivery.driverLiveTracking')
              : t('delivery.customerLiveTracking')
          }
          variant="h3"
        />
        {isLive ? (
          <View style={styles.livePill}>
            <TextView text={t('delivery.live')} variant="caption" style={styles.liveText} />
          </View>
        ) : null}
      </View>
      <TextView text={t(`delivery.status.${order.status}`)} variant="bodySmall" muted />
      <TextView
        text={t('delivery.liveEta', {minutes: eta, price: formatCurrency(order.price)})}
        variant="bodySmall"
      />
      <TextView text={updatedLabel} variant="caption" muted />
      {isBackgroundTracking ? (
        <TextView text={t('delivery.backgroundTrackingActive')} variant="caption" muted />
      ) : null}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${Math.round(progress * 100)}%`}]} />
      </View>
      <TextView
        text={t('delivery.routeProgress', {percent: Math.round(progress * 100)})}
        variant="caption"
        muted
      />
      {order.driver ? (
        <TextView
          text={t('delivery.driverLine', {
            name: order.driver.name,
            vehicle: order.driver.vehicle,
            rating: order.driver.rating,
          })}
          variant="caption"
          muted
        />
      ) : null}
    </Card>
  );
};

export default LiveTrackingCard;
