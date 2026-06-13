import {useEffect, useState} from 'react';

import {deliveryClient} from '@api/clients/deliveryClient';
import {getLiveRouteProgress, isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {syncOrderTracking} from '@redux/slices/deliverySlice';
import {isDriverLocationEngineRunning} from '@services/deliveryServices/driverLocationEngine';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

import type {DeliveryOrder} from '@Types/deliveryTypes';

export type LiveTrackingRole = 'customer' | 'driver';

type LiveTrackingOptions = {
  pollEnabled?: boolean;
};

type LiveTrackingState = {
  isLive: boolean;
  progress: number;
  lastUpdatedAt: number | null;
  isBackgroundTracking: boolean;
};

const CUSTOMER_POLL_INTERVAL_MS = 5000;

/**
 * Driver GPS is handled by `useDriverBackgroundTracking` / `driverLocationEngine`.
 * Customers poll the server for the latest courier location.
 */
export const useLiveDeliveryTracking = (
  order: DeliveryOrder | undefined,
  role: LiveTrackingRole,
  options: LiveTrackingOptions = {},
): LiveTrackingState => {
  const dispatch = useAppDispatch();
  const {activeDriverOrderId} = useAppSelector(state => state.delivery);
  const pollEnabled = options.pollEnabled ?? true;
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const isDriverForOrder =
    role === 'driver' && activeDriverOrderId === order?.id && order?.driver?.id === 'drv-you';

  const shouldTrack = !!order?.driver && isLiveTrackingStatus(order.status);

  const progress = order ? getLiveRouteProgress(order) : 0;

  useEffect(() => {
    if (!isDriverForOrder || !order?.driver?.coordinate) {
      return;
    }
    setLastUpdatedAt(Date.now());
  }, [
    isDriverForOrder,
    order?.driver?.coordinate.latitude,
    order?.driver?.coordinate.longitude,
  ]);

  useEffect(() => {
    if (
      !order ||
      role !== 'customer' ||
      !shouldTrack ||
      !pollEnabled ||
      order.status === 'cancelled'
    ) {
      return undefined;
    }

    let cancelled = false;

    const pollTracking = async () => {
      try {
        const snapshot = await deliveryClient.getOrderTracking(order.id);
        if (cancelled) {
          return;
        }
        dispatch(syncOrderTracking(snapshot));
        setLastUpdatedAt(Date.now());
      } catch (error) {
        console.warn('Failed to poll order tracking', error);
      }
    };

    void pollTracking();
    const intervalId = setInterval(pollTracking, CUSTOMER_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [dispatch, order?.id, order?.status, pollEnabled, role, shouldTrack]);

  return {
    isLive: shouldTrack,
    progress,
    lastUpdatedAt,
    isBackgroundTracking: isDriverForOrder && isDriverLocationEngineRunning(order?.id),
  };
};
