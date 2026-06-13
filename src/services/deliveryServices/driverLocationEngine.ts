import Geolocation from '@react-native-community/geolocation';
import {Platform} from 'react-native';

import {deliveryClient} from '@api/clients/deliveryClient';
import {isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {
  configureDriverBackgroundGeolocation,
  requestDriverBackgroundLocationPermission,
} from '@helpers/locationHelpers';
import {updateDriverLocation} from '@redux/slices/deliverySlice';

import type {AppDispatch} from '@Types/appDispatch';
import type {DeliveryOrder, GeoPoint} from '@Types/deliveryTypes';

type EngineListener = (lastUpdatedAt: number) => void;

const MIN_UPDATE_INTERVAL_MS = 5000;
const MIN_COORD_DELTA = 0.00005;

let watchId: number | null = null;
let activeOrderId: string | null = null;
let listeners = new Set<EngineListener>();
let dispatchRef: AppDispatch | null = null;
let activeOrderRef: DeliveryOrder | null = null;
let lastPostAt = 0;
let lastPostedCoordinate: GeoPoint | null = null;
let lastReduxCoordinate: GeoPoint | null = null;

const notifyListeners = () => {
  listeners.forEach(listener => listener(Date.now()));
};

const hasMovedEnough = (
  coordinate: GeoPoint,
  previous: GeoPoint | null,
  minDelta = MIN_COORD_DELTA,
): boolean => {
  if (!previous) {
    return true;
  }
  const latDiff = Math.abs(coordinate.latitude - previous.latitude);
  const lngDiff = Math.abs(coordinate.longitude - previous.longitude);
  return latDiff + lngDiff >= minDelta;
};

const shouldSyncLocation = (coordinate: GeoPoint): boolean => {
  const now = Date.now();
  if (now - lastPostAt < MIN_UPDATE_INTERVAL_MS) {
    return false;
  }
  return hasMovedEnough(coordinate, lastPostedCoordinate);
};

const pushLocation = (coordinate: GeoPoint) => {
  if (!activeOrderRef || !dispatchRef) {
    return;
  }

  if (hasMovedEnough(coordinate, lastReduxCoordinate, MIN_COORD_DELTA / 2)) {
    dispatchRef(updateDriverLocation({orderId: activeOrderRef.id, coordinate}));
    lastReduxCoordinate = coordinate;
    notifyListeners();
  }

  if (!shouldSyncLocation(coordinate)) {
    return;
  }

  lastPostAt = Date.now();
  lastPostedCoordinate = coordinate;

  void deliveryClient.postDriverLocation(activeOrderRef.id, coordinate).catch(error => {
    console.warn('Failed to post driver location', error);
  });
};

const startGpsWatch = () => {
  watchId = Geolocation.watchPosition(
    position => {
      pushLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    error => {
      console.warn('Driver GPS watch error', error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
      fastestInterval: 3000,
      ...(Platform.OS === 'ios' ? {showsBackgroundLocationIndicator: true} : {}),
    },
  );
};

export const subscribeDriverLocationEngine = (listener: EngineListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const isDriverLocationEngineRunning = (orderId?: string): boolean =>
  activeOrderId !== null && (orderId ? activeOrderId === orderId : true);

export const startDriverLocationEngine = async (
  order: DeliveryOrder,
  dispatch: AppDispatch,
): Promise<boolean> => {
  if (activeOrderId === order.id && watchId !== null) {
    activeOrderRef = order;
    dispatchRef = dispatch;
    return true;
  }

  await stopDriverLocationEngine();

  if (!order.driver || !isLiveTrackingStatus(order.status)) {
    return false;
  }

  configureDriverBackgroundGeolocation();
  const permissions = await requestDriverBackgroundLocationPermission();
  if (!permissions.foreground) {
    return false;
  }

  activeOrderId = order.id;
  activeOrderRef = order;
  dispatchRef = dispatch;
  lastPostAt = 0;
  lastPostedCoordinate = null;
  lastReduxCoordinate = null;

  startGpsWatch();
  return true;
};

export const stopDriverLocationEngine = async (): Promise<void> => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }

  listeners.clear();
  activeOrderId = null;
  activeOrderRef = null;
  dispatchRef = null;
  lastPostAt = 0;
  lastPostedCoordinate = null;
  lastReduxCoordinate = null;
};

export const syncDriverLocationEngineOrder = (order: DeliveryOrder | undefined): void => {
  if (!order || activeOrderId !== order.id) {
    return;
  }

  activeOrderRef = order;

  if (order.status === 'delivered' || order.status === 'cancelled') {
    void stopDriverLocationEngine();
  }
};
