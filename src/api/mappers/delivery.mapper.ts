import type {OrderTrackingResponseDto} from '@api/server/delivery.dto';

import type {DeliveryOrder, GeoPoint} from '@Types/deliveryTypes';

export type OrderTrackingSnapshot = {
  orderId: string;
  status: DeliveryOrder['status'];
  etaMinutes: number;
  timeline: DeliveryOrder['timeline'];
  driver?: DeliveryOrder['driver'];
  updatedAt: string;
};

export const mapTrackingDtoToSnapshot = (
  dto: OrderTrackingResponseDto,
): OrderTrackingSnapshot => ({
  orderId: dto.orderId,
  status: dto.status,
  etaMinutes: dto.etaMinutes,
  timeline: dto.timeline,
  updatedAt: dto.updatedAt,
  driver: dto.driver
    ? {
        id: dto.driver.id,
        name: dto.driver.name,
        phone: dto.driver.phone,
        rating: dto.driver.rating,
        vehicle: dto.driver.vehicle,
        coordinate: {
          latitude: dto.driver.latitude,
          longitude: dto.driver.longitude,
        },
      }
    : undefined,
});

export const mapGeoPointToLocationPayload = (coordinate: GeoPoint, recordedAt = new Date()) => ({
  latitude: coordinate.latitude,
  longitude: coordinate.longitude,
  recordedAt: recordedAt.toISOString(),
});
