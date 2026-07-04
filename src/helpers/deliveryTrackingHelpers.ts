import type {DeliveryOrder, DeliveryStatus, GeoPoint} from '@Types/deliveryTypes';

/** Haversine distance in kilometres. */
export const distanceKm = (from: GeoPoint, to: GeoPoint): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** 0 = at pickup, 1 = at dropoff (along straight line). */
export const getRouteProgress = (
  pickup: GeoPoint,
  dropoff: GeoPoint,
  current: GeoPoint,
): number => {
  const total = distanceKm(pickup, dropoff);
  if (total <= 0.001) {
    return 1;
  }
  const fromStart = distanceKm(pickup, current);
  return Math.max(0, Math.min(1, fromStart / total));
};

export const getRemainingEtaMinutes = (
  pickup: GeoPoint,
  dropoff: GeoPoint,
  driverPosition: GeoPoint | undefined,
  fallbackEta: number,
): number => {
  if (!driverPosition) {
    return fallbackEta;
  }
  const remainingKm = distanceKm(driverPosition, dropoff);
  const minutes = Math.round(remainingKm * 8 + 3);
  return Math.max(1, Math.min(fallbackEta || 45, minutes));
};

export const getMapRegionForPoints = (
  points: GeoPoint[],
  padding = 0.02,
): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} => {
  if (!points.length) {
    return {
      latitude: 25.2048,
      longitude: 55.2708,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }

  const lats = points.map(p => p.latitude);
  const lngs = points.map(p => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(padding, (maxLat - minLat) * 1.6 + padding),
    longitudeDelta: Math.max(padding, (maxLng - minLng) * 1.6 + padding),
  };
};

export const isLiveTrackingStatus = (status: DeliveryStatus): boolean =>
  status === 'accepted' || status === 'picked_up' || status === 'in_transit';

export const getLiveRouteProgress = (order: DeliveryOrder): number => {
  if (!order.driver) {
    return 0;
  }
  const target =
    order.status === 'accepted' ? order.pickup.coordinate : order.dropoff.coordinate;
  return getRouteProgress(order.pickup.coordinate, target, order.driver.coordinate);
};

export const getTrackingTarget = (order: DeliveryOrder): GeoPoint => {
  if (order.status === 'accepted') {
    return order.pickup.coordinate;
  }
  if (order.status === 'picked_up' || order.status === 'in_transit') {
    return order.dropoff.coordinate;
  }
  return order.dropoff.coordinate;
};
