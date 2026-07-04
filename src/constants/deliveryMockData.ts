import type {DeliveryAddress, DeliveryOrder} from '@Types/deliveryTypes';

/** Demo map center — Dubai Downtown (Talabat/Uber-style MENA demo). */
export const DEFAULT_MAP_REGION = {
  latitude: 25.2048,
  longitude: 55.2708,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const SEED_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-home',
    label: 'Home',
    addressLine: 'Downtown Dubai, Boulevard Plaza',
    coordinate: {latitude: 25.1972, longitude: 55.2744},
  },
  {
    id: 'addr-office',
    label: 'Office',
    addressLine: 'DIFC Gate Village, Building 3',
    coordinate: {latitude: 25.2103, longitude: 55.2796},
  },
  {
    id: 'addr-mall',
    label: 'Dubai Mall',
    addressLine: 'Financial Centre Rd, Dubai',
    coordinate: {latitude: 25.1975, longitude: 55.2796},
  },
];

export const SEED_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: 'del-1001',
    status: 'in_transit',
    pickup: SEED_ADDRESSES[2],
    dropoff: SEED_ADDRESSES[0],
    packageType: 'food',
    notes: 'Leave at reception',
    price: 18.5,
    etaMinutes: 12,
    driver: {
      id: 'drv-1',
      name: 'Ahmed Hassan',
      phone: '+971 50 123 4567',
      rating: 4.9,
      vehicle: 'Motorcycle',
      coordinate: {latitude: 25.1998, longitude: 55.2765},
    },
    timeline: [
      {id: 't1', status: 'pending', label: 'Order placed', timestamp: '2026-06-12T10:00:00Z'},
      {id: 't2', status: 'accepted', label: 'Courier assigned', timestamp: '2026-06-12T10:05:00Z'},
      {id: 't3', status: 'picked_up', label: 'Picked up', timestamp: '2026-06-12T10:18:00Z'},
      {id: 't4', status: 'in_transit', label: 'On the way', timestamp: '2026-06-12T10:22:00Z'},
    ],
    createdAt: '2026-06-12T10:00:00Z',
  },
  {
    id: 'del-1003',
    status: 'pending',
    pickup: SEED_ADDRESSES[1],
    dropoff: SEED_ADDRESSES[2],
    packageType: 'parcel',
    price: 16,
    etaMinutes: 15,
    timeline: [{id: 't1', status: 'pending', label: 'Order placed', timestamp: '2026-06-12T11:00:00Z'}],
    createdAt: '2026-06-12T11:00:00Z',
  },
  {
    id: 'del-1002',
    status: 'delivered',
    pickup: SEED_ADDRESSES[1],
    dropoff: SEED_ADDRESSES[0],
    packageType: 'document',
    price: 14,
    etaMinutes: 0,
    driver: {
      id: 'drv-2',
      name: 'Sara Ali',
      phone: '+971 55 987 6543',
      rating: 4.8,
      vehicle: 'Car',
      coordinate: SEED_ADDRESSES[0].coordinate,
    },
    timeline: [
      {id: 't1', status: 'pending', label: 'Order placed', timestamp: '2026-06-11T14:00:00Z'},
      {id: 't2', status: 'delivered', label: 'Delivered', timestamp: '2026-06-11T14:35:00Z'},
    ],
    createdAt: '2026-06-11T14:00:00Z',
  },
];
