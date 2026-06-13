export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DeliveryPackageType = 'document' | 'food' | 'parcel' | 'fragile';

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type DeliveryAddress = {
  id: string;
  label: string;
  addressLine: string;
  coordinate: GeoPoint;
};

export type DeliveryDriver = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  coordinate: GeoPoint;
};

export type DeliveryTimelineEvent = {
  id: string;
  status: DeliveryStatus;
  label: string;
  timestamp: string;
};

export type DeliveryOrder = {
  id: string;
  status: DeliveryStatus;
  pickup: DeliveryAddress;
  dropoff: DeliveryAddress;
  packageType: DeliveryPackageType;
  notes?: string;
  price: number;
  etaMinutes: number;
  driver?: DeliveryDriver;
  timeline: DeliveryTimelineEvent[];
  createdAt: string;
};

export type DeliveryState = {
  orders: DeliveryOrder[];
  savedAddresses: DeliveryAddress[];
  driverMode: boolean;
  driverAvailable: boolean;
  activeDriverOrderId: string | null;
};
