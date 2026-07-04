import type {DeliveryStatus} from '@Types/deliveryTypes';

export type DeliveryTimelineEventDto = {
  id: string;
  status: DeliveryStatus;
  label: string;
  timestamp: string;
};

export type DriverLocationPayloadDto = {
  latitude: number;
  longitude: number;
  recordedAt?: string;
};

export type OrderStatusPayloadDto = {
  status: DeliveryStatus;
  label: string;
};

export type DriverTrackingDto = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  latitude: number;
  longitude: number;
  locationUpdatedAt: string;
};

export type OrderTrackingResponseDto = {
  orderId: string;
  status: DeliveryStatus;
  etaMinutes: number;
  timeline: DeliveryTimelineEventDto[];
  driver?: DriverTrackingDto;
  updatedAt: string;
};

export type DriverLocationPostResponseDto = {
  orderId: string;
  recordedAt: string;
};

export type CreateDeliveryOrderPayloadDto = {
  pickupId: string;
  dropoffId: string;
  packageType: string;
  notes?: string;
  price: number;
  etaMinutes: number;
};

export type CreateDeliveryOrderResponseDto = OrderTrackingResponseDto;
