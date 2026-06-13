import {useEffect, useState} from 'react';

import {isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {
  isDriverLocationEngineRunning,
  startDriverLocationEngine,
  stopDriverLocationEngine,
  subscribeDriverLocationEngine,
  syncDriverLocationEngineOrder,
} from '@services/deliveryServices/driverLocationEngine';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

/**
 * Keeps courier GPS broadcasting while the driver has an active job,
 * including when the app moves to the background.
 */
export const useDriverBackgroundTracking = (): {
  isBackgroundTracking: boolean;
  lastUpdatedAt: number | null;
} => {
  const dispatch = useAppDispatch();
  const {driverMode, activeDriverOrderId, orders} = useAppSelector(state => state.delivery);
  const activeOrder = orders.find(order => order.id === activeDriverOrderId);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const shouldTrack =
    driverMode &&
    !!activeOrder &&
    activeOrder.driver?.id === 'drv-you' &&
    isLiveTrackingStatus(activeOrder.status);

  useEffect(() => {
    if (!shouldTrack || !activeOrder) {
      void stopDriverLocationEngine();
      setLastUpdatedAt(null);
      return undefined;
    }

    void startDriverLocationEngine(activeOrder, dispatch);

    return () => {
      void stopDriverLocationEngine();
    };
  }, [activeOrder?.id, activeOrder?.status, activeOrder?.driver?.id, dispatch, shouldTrack]);

  useEffect(() => {
    syncDriverLocationEngineOrder(activeOrder);
  }, [activeOrder?.id, activeOrder?.status]);

  useEffect(() => {
    if (!shouldTrack) {
      return undefined;
    }
    return subscribeDriverLocationEngine(setLastUpdatedAt);
  }, [shouldTrack, activeOrder?.id]);

  return {
    isBackgroundTracking: shouldTrack && isDriverLocationEngineRunning(activeOrder?.id),
    lastUpdatedAt,
  };
};
