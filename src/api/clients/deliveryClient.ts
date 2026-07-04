import {apiClient} from '@config/network/client';

import {
  mapGeoPointToLocationPayload,
  mapTrackingDtoToSnapshot,
  type OrderTrackingSnapshot,
} from '@api/mappers/delivery.mapper';
import type {
  CreateDeliveryOrderPayloadDto,
  CreateDeliveryOrderResponseDto,
  DriverLocationPostResponseDto,
  DriverLocationPayloadDto,
  OrderStatusPayloadDto,
  OrderTrackingResponseDto,
} from '@api/server/delivery.dto';

import type {DeliveryOrder, DeliveryStatus, GeoPoint} from '@Types/deliveryTypes';

export const deliveryClient = {
  getOrderTracking: async (orderId: string): Promise<OrderTrackingSnapshot> => {
    const {data} = await apiClient.get<OrderTrackingResponseDto>(
      `/delivery/orders/${orderId}/tracking`,
    );
    return mapTrackingDtoToSnapshot(data);
  },

  postDriverLocation: async (
    orderId: string,
    coordinate: GeoPoint,
  ): Promise<DriverLocationPostResponseDto> => {
    const payload: DriverLocationPayloadDto = mapGeoPointToLocationPayload(coordinate);
    const {data} = await apiClient.post<DriverLocationPostResponseDto>(
      `/delivery/orders/${orderId}/driver-location`,
      payload,
    );
    return data;
  },

  updateOrderStatus: async (
    orderId: string,
    status: DeliveryStatus,
    label: string,
  ): Promise<OrderTrackingResponseDto> => {
    const payload: OrderStatusPayloadDto = {status, label};
    const {data} = await apiClient.patch<OrderTrackingResponseDto>(
      `/delivery/orders/${orderId}/status`,
      payload,
    );
    return data;
  },

  acceptOrderAsDriver: async (orderId: string): Promise<OrderTrackingResponseDto> => {
    const {data} = await apiClient.post<OrderTrackingResponseDto>(
      `/delivery/orders/${orderId}/accept`,
    );
    return data;
  },

  cancelOrder: async (orderId: string): Promise<OrderTrackingResponseDto> => {
    const {data} = await apiClient.post<OrderTrackingResponseDto>(
      `/delivery/orders/${orderId}/cancel`,
    );
    return data;
  },

  createOrder: async (
    payload: CreateDeliveryOrderPayloadDto,
  ): Promise<OrderTrackingSnapshot> => {
    const {data} = await apiClient.post<CreateDeliveryOrderResponseDto>(
      '/delivery/orders',
      payload,
    );
    return mapTrackingDtoToSnapshot(data);
  },
};
