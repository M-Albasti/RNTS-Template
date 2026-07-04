import {deliveryClient} from '@api/clients/deliveryClient';
import {mapTrackingDtoToSnapshot} from '@api/mappers/delivery.mapper';

import {addDeliveryOrder, setActiveDriverOrderId, syncOrderTracking} from '@redux/slices/deliverySlice';

import type {AppDispatch} from '@Types/appDispatch';
import type {
  DeliveryAddress,
  DeliveryPackageType,
  DeliveryStatus,
} from '@Types/deliveryTypes';

export const createDeliveryOrderOnServer = async (
  dispatch: AppDispatch,
  payload: {
    pickup: DeliveryAddress;
    dropoff: DeliveryAddress;
    packageType: DeliveryPackageType;
    notes?: string;
    price: number;
    etaMinutes: number;
  },
): Promise<string> => {
  const snapshot = await deliveryClient.createOrder({
    pickupId: payload.pickup.id,
    dropoffId: payload.dropoff.id,
    packageType: payload.packageType,
    notes: payload.notes,
    price: payload.price,
    etaMinutes: payload.etaMinutes,
  });

  dispatch(
    addDeliveryOrder({
      id: snapshot.orderId,
      status: snapshot.status,
      pickup: payload.pickup,
      dropoff: payload.dropoff,
      packageType: payload.packageType,
      notes: payload.notes,
      price: payload.price,
      etaMinutes: snapshot.etaMinutes,
      timeline: snapshot.timeline,
      createdAt: new Date().toISOString(),
    }),
  );

  return snapshot.orderId;
};

export const acceptDeliveryJobOnServer = async (
  dispatch: AppDispatch,
  orderId: string,
): Promise<void> => {
  const response = await deliveryClient.acceptOrderAsDriver(orderId);
  dispatch(syncOrderTracking(mapTrackingDtoToSnapshot(response)));
  dispatch(setActiveDriverOrderId(orderId));
};

export const updateDeliveryStatusOnServer = async (
  dispatch: AppDispatch,
  orderId: string,
  status: DeliveryStatus,
  label: string,
): Promise<void> => {
  const response = await deliveryClient.updateOrderStatus(orderId, status, label);
  dispatch(syncOrderTracking(mapTrackingDtoToSnapshot(response)));
  if (status === 'delivered') {
    dispatch(setActiveDriverOrderId(null));
  }
};

export const cancelDeliveryOrderOnServer = async (
  dispatch: AppDispatch,
  orderId: string,
): Promise<void> => {
  const response = await deliveryClient.cancelOrder(orderId);
  dispatch(syncOrderTracking(mapTrackingDtoToSnapshot(response)));
  dispatch(setActiveDriverOrderId(null));
};
