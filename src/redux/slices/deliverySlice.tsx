import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {
  SEED_ADDRESSES,
  SEED_DELIVERY_ORDERS,
} from '@constants/deliveryMockData';

import type {
  DeliveryAddress,
  DeliveryOrder,
  DeliveryPackageType,
  DeliveryStatus,
  DeliveryTimelineEvent,
} from '@Types/deliveryTypes';

export type {DeliveryState} from '@Types/deliveryTypes';

const nowIso = () => new Date().toISOString();

const createTimelineEvent = (
  status: DeliveryStatus,
  label: string,
): DeliveryTimelineEvent => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  status,
  label,
  timestamp: nowIso(),
});

const initialState = {
  orders: SEED_DELIVERY_ORDERS,
  savedAddresses: SEED_ADDRESSES,
  driverMode: false,
  driverAvailable: false,
  activeDriverOrderId: null as string | null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    createDeliveryOrder: (
      state,
      action: PayloadAction<{
        pickup: DeliveryAddress;
        dropoff: DeliveryAddress;
        packageType: DeliveryPackageType;
        notes?: string;
        price: number;
        etaMinutes: number;
      }>,
    ) => {
      const order: DeliveryOrder = {
        id: `del-${Date.now()}`,
        status: 'pending',
        pickup: action.payload.pickup,
        dropoff: action.payload.dropoff,
        packageType: action.payload.packageType,
        notes: action.payload.notes,
        price: action.payload.price,
        etaMinutes: action.payload.etaMinutes,
        timeline: [createTimelineEvent('pending', 'Order placed')],
        createdAt: nowIso(),
      };
      state.orders.unshift(order);
    },
    addDeliveryOrder: (state, action: PayloadAction<DeliveryOrder>) => {
      const existingIndex = state.orders.findIndex(order => order.id === action.payload.id);
      if (existingIndex >= 0) {
        state.orders[existingIndex] = action.payload;
        return;
      }
      state.orders.unshift(action.payload);
    },
    assignDriverToOrder: (
      state,
      action: PayloadAction<{orderId: string; driver: DeliveryOrder['driver']}>,
    ) => {
      const order = state.orders.find(item => item.id === action.payload.orderId);
      if (!order || !action.payload.driver) {
        return;
      }
      order.driver = action.payload.driver;
      order.status = 'accepted';
      order.timeline.push(createTimelineEvent('accepted', 'Courier assigned'));
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{orderId: string; status: DeliveryStatus; label: string}>,
    ) => {
      const order = state.orders.find(item => item.id === action.payload.orderId);
      if (!order) {
        return;
      }
      order.status = action.payload.status;
      order.timeline.push(
        createTimelineEvent(action.payload.status, action.payload.label),
      );
      if (action.payload.status === 'delivered') {
        order.etaMinutes = 0;
        state.activeDriverOrderId = null;
      }
    },
    updateDriverLocation: (
      state,
      action: PayloadAction<{orderId: string; coordinate: DeliveryAddress['coordinate']}>,
    ) => {
      const order = state.orders.find(item => item.id === action.payload.orderId);
      if (order?.driver) {
        order.driver.coordinate = action.payload.coordinate;
        if (order.status === 'in_transit') {
          const latDiff = Math.abs(
            action.payload.coordinate.latitude - order.dropoff.coordinate.latitude,
          );
          const lngDiff = Math.abs(
            action.payload.coordinate.longitude - order.dropoff.coordinate.longitude,
          );
          order.etaMinutes = Math.max(1, Math.round((latDiff + lngDiff) * 600));
        }
      }
    },
    syncOrderTracking: (
      state,
      action: PayloadAction<{
        orderId: string;
        status: DeliveryStatus;
        etaMinutes: number;
        timeline: DeliveryTimelineEvent[];
        driver?: DeliveryOrder['driver'];
      }>,
    ) => {
      const order = state.orders.find(item => item.id === action.payload.orderId);
      if (!order) {
        return;
      }
      if (order.status === 'cancelled' && action.payload.status !== 'cancelled') {
        return;
      }
      order.status = action.payload.status;
      order.etaMinutes = action.payload.etaMinutes;
      order.timeline = action.payload.timeline;
      if (action.payload.driver) {
        order.driver = action.payload.driver;
      }
      if (action.payload.status === 'delivered' || action.payload.status === 'cancelled') {
        if (state.activeDriverOrderId === order.id) {
          state.activeDriverOrderId = null;
        }
      }
    },
    cancelDeliveryOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(item => item.id === action.payload);
      if (!order || order.status === 'delivered') {
        return;
      }
      order.status = 'cancelled';
      order.timeline.push(createTimelineEvent('cancelled', 'Order cancelled'));
      if (state.activeDriverOrderId === order.id) {
        state.activeDriverOrderId = null;
      }
    },
    addSavedAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      state.savedAddresses.push(action.payload);
    },
    setDriverMode: (state, action: PayloadAction<boolean>) => {
      state.driverMode = action.payload;
    },
    setDriverAvailable: (state, action: PayloadAction<boolean>) => {
      state.driverAvailable = action.payload;
    },
    setActiveDriverOrderId: (state, action: PayloadAction<string | null>) => {
      state.activeDriverOrderId = action.payload;
    },
    acceptDriverJob: (state, action: PayloadAction<string>) => {
      state.activeDriverOrderId = action.payload;
      const order = state.orders.find(item => item.id === action.payload);
      if (order) {
        order.status = 'accepted';
        order.driver = {
          id: 'drv-you',
          name: 'You (Courier)',
          phone: '+971 50 000 0000',
          rating: 5,
          vehicle: 'Motorcycle',
          coordinate: order.pickup.coordinate,
        };
        order.timeline.push(createTimelineEvent('accepted', 'You accepted the job'));
      }
    },
  },
});

export const {
  createDeliveryOrder,
  addDeliveryOrder,
  assignDriverToOrder,
  updateOrderStatus,
  updateDriverLocation,
  syncOrderTracking,
  cancelDeliveryOrder,
  addSavedAddress,
  setDriverMode,
  setDriverAvailable,
  setActiveDriverOrderId,
  acceptDriverJob,
} = deliverySlice.actions;

export default deliverySlice.reducer;
