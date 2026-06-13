import Geolocation from '@react-native-community/geolocation';
import {Platform, PermissionsAndroid} from 'react-native';

import {DEFAULT_MAP_REGION} from '@constants/deliveryMockData';

import type {GeoPoint} from '@Types/deliveryTypes';

export type LocationPermissionStatus = {
  foreground: boolean;
  background: boolean;
};

export const configureDriverBackgroundGeolocation = (): void => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always',
    enableBackgroundLocationUpdates: true,
    locationProvider: 'auto',
  });
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  configureDriverBackgroundGeolocation();
  try {
    await getCurrentPosition();
    return true;
  } catch {
    return false;
  }
};

export const getDriverBackgroundPermissionStatus =
  async (): Promise<LocationPermissionStatus> => {
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (Platform.Version < 29) {
        return {foreground: fine, background: fine};
      }
      const background = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
      return {foreground: fine, background: background && fine};
    }

    // iOS has no read API here; the permission card prompts on demand.
    return {foreground: false, background: false};
  };

export const requestDriverBackgroundLocationPermission =
  async (): Promise<LocationPermissionStatus> => {
    configureDriverBackgroundGeolocation();

    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
        return {foreground: false, background: false};
      }

      if (Platform.Version >= 29) {
        const background = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        return {
          foreground: true,
          background: background === PermissionsAndroid.RESULTS.GRANTED,
        };
      }

      return {foreground: true, background: true};
    }

    const allowed = await requestLocationPermission();
    return {foreground: allowed, background: allowed};
  };

export const getCurrentPosition = (): Promise<GeoPoint> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => reject(error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

export const getCurrentPositionSafe = async (): Promise<GeoPoint> => {
  try {
    const allowed = await requestLocationPermission();
    if (!allowed) {
      return {
        latitude: DEFAULT_MAP_REGION.latitude,
        longitude: DEFAULT_MAP_REGION.longitude,
      };
    }
    return await getCurrentPosition();
  } catch {
    return {
      latitude: DEFAULT_MAP_REGION.latitude,
      longitude: DEFAULT_MAP_REGION.longitude,
    };
  }
};

/** Linear interpolation between two coordinates (0–1). */
export const interpolateCoordinate = (
  from: GeoPoint,
  to: GeoPoint,
  progress: number,
): GeoPoint => ({
  latitude: from.latitude + (to.latitude - from.latitude) * progress,
  longitude: from.longitude + (to.longitude - from.longitude) * progress,
});

/** Rough ETA minutes from straight-line distance (demo formula). */
export const estimateDeliveryMinutes = (from: GeoPoint, to: GeoPoint): number => {
  const latDiff = Math.abs(from.latitude - to.latitude);
  const lngDiff = Math.abs(from.longitude - to.longitude);
  const distanceScore = (latDiff + lngDiff) * 600;
  return Math.max(8, Math.min(45, Math.round(distanceScore)));
};

export const estimateDeliveryPrice = (minutes: number, packageType: string): number => {
  const base = 10;
  const perMinute = 0.6;
  const typeFee =
    packageType === 'fragile' ? 5 : packageType === 'food' ? 2 : 0;
  return Math.round((base + minutes * perMinute + typeFee) * 100) / 100;
};

export const formatCurrency = (amount: number, currency = 'AED'): string =>
  `${currency} ${amount.toFixed(2)}`;
