import type MockAdapter from 'axios-mock-adapter';

import {SEED_ADDRESSES, SEED_DELIVERY_ORDERS} from '@constants/deliveryMockData';

import type {
  CreateDeliveryOrderPayloadDto,
  OrderTrackingResponseDto,
} from '@api/server/delivery.dto';

import type {
  DeliveryAddress,
  DeliveryOrder,
  DeliveryPackageType,
  DeliveryStatus,
} from '@Types/deliveryTypes';

const cloneOrders = (): DeliveryOrder[] =>
  JSON.parse(JSON.stringify(SEED_DELIVERY_ORDERS)) as DeliveryOrder[];

let ordersStore: DeliveryOrder[] = cloneOrders();

const nowIso = () => new Date().toISOString();

const findOrder = (orderId: string): DeliveryOrder | undefined =>
  ordersStore.find(order => order.id === orderId);

const findAddress = (addressId: string): DeliveryAddress | undefined =>
  SEED_ADDRESSES.find(address => address.id === addressId);

const toTrackingDto = (order: DeliveryOrder): OrderTrackingResponseDto => ({
  orderId: order.id,
  status: order.status,
  etaMinutes: order.etaMinutes,
  timeline: order.timeline,
  updatedAt: nowIso(),
  driver: order.driver
    ? {
        id: order.driver.id,
        name: order.driver.name,
        phone: order.driver.phone,
        rating: order.driver.rating,
        vehicle: order.driver.vehicle,
        latitude: order.driver.coordinate.latitude,
        longitude: order.driver.coordinate.longitude,
        locationUpdatedAt: nowIso(),
      }
    : undefined,
});

const appendTimeline = (order: DeliveryOrder, status: DeliveryStatus, label: string) => {
  order.status = status;
  order.timeline.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status,
    label,
    timestamp: nowIso(),
  });
  if (status === 'delivered') {
    order.etaMinutes = 0;
  }
};

const parseOrderId = (url?: string): string => url?.split('/')[3] ?? '';

export const registerDeliveryMocks = (mock: MockAdapter): void => {
  ordersStore = cloneOrders();

  mock.onPost('/delivery/orders').reply(config => {
    const body = JSON.parse(config.data as string) as CreateDeliveryOrderPayloadDto;
    const pickup = findAddress(body.pickupId);
    const dropoff = findAddress(body.dropoffId);

    if (!pickup || !dropoff || pickup.id === dropoff.id) {
      return [400, {message: 'Invalid pickup or dropoff'}];
    }

    const order: DeliveryOrder = {
      id: `del-${Date.now()}`,
      status: 'pending',
      pickup,
      dropoff,
      packageType: body.packageType as DeliveryPackageType,
      notes: body.notes,
      price: body.price,
      etaMinutes: body.etaMinutes,
      timeline: [
        {
          id: `${Date.now()}-pending`,
          status: 'pending',
          label: 'Order placed',
          timestamp: nowIso(),
        },
      ],
      createdAt: nowIso(),
    };

    ordersStore.unshift(order);
    return [201, toTrackingDto(order)];
  });

  mock.onGet(/\/delivery\/orders\/[^/]+\/tracking$/).reply(config => {
    const orderId = parseOrderId(config.url);
    const current = findOrder(orderId);
    if (!current) {
      return [404, {message: 'Order not found'}];
    }
    return [200, toTrackingDto(current)];
  });

  mock.onPost(/\/delivery\/orders\/[^/]+\/driver-location$/).reply(config => {
    const orderId = parseOrderId(config.url);
    const current = findOrder(orderId);
    if (!current?.driver) {
      return [404, {message: 'Order or driver not found'}];
    }

    const body = JSON.parse(config.data as string) as {
      latitude: number;
      longitude: number;
    };

    current.driver.coordinate = {
      latitude: body.latitude,
      longitude: body.longitude,
    };

    if (current.status === 'in_transit') {
      const latDiff = Math.abs(body.latitude - current.dropoff.coordinate.latitude);
      const lngDiff = Math.abs(body.longitude - current.dropoff.coordinate.longitude);
      current.etaMinutes = Math.max(1, Math.round((latDiff + lngDiff) * 600));
    }

    return [
      200,
      {
        orderId: current.id,
        recordedAt: nowIso(),
      },
    ];
  });

  mock.onPatch(/\/delivery\/orders\/[^/]+\/status$/).reply(config => {
    const orderId = parseOrderId(config.url);
    const current = findOrder(orderId);
    if (!current) {
      return [404, {message: 'Order not found'}];
    }

    const body = JSON.parse(config.data as string) as {
      status: DeliveryStatus;
      label: string;
    };

    appendTimeline(current, body.status, body.label);
    return [200, toTrackingDto(current)];
  });

  mock.onPost(/\/delivery\/orders\/[^/]+\/accept$/).reply(config => {
    const orderId = parseOrderId(config.url);
    const current = findOrder(orderId);
    if (!current || current.status !== 'pending') {
      return [409, {message: 'Order is not available'}];
    }

    const activeJob = ordersStore.find(
      order =>
        order.driver?.id === 'drv-you' &&
        !['delivered', 'cancelled', 'pending'].includes(order.status),
    );
    if (activeJob) {
      return [409, {message: 'Finish your active delivery first'}];
    }

    current.driver = {
      id: 'drv-you',
      name: 'You (Courier)',
      phone: '+971 50 000 0000',
      rating: 5,
      vehicle: 'Motorcycle',
      coordinate: current.pickup.coordinate,
    };
    appendTimeline(current, 'accepted', 'You accepted the job');
    return [200, toTrackingDto(current)];
  });

  mock.onPost(/\/delivery\/orders\/[^/]+\/cancel$/).reply(config => {
    const orderId = parseOrderId(config.url);
    const current = findOrder(orderId);
    if (!current || current.status === 'delivered') {
      return [409, {message: 'Order cannot be cancelled'}];
    }

    appendTimeline(current, 'cancelled', 'Order cancelled');
    return [200, toTrackingDto(current)];
  });
};
