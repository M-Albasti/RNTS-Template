export type MarketplaceCategory = {
  id: string;
  nameKey: string;
  icon: string;
  color: string;
};

export type MarketplaceProduct = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageEmoji: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isEnabled: boolean;
  merchantId?: string;
  isOwnListing?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type MarketplaceOrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type MarketplaceOrderItem = {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  merchantId?: string;
};

export type MarketplaceOrder = {
  id: string;
  items: MarketplaceOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: MarketplaceOrderStatus;
  addressLine: string;
  paymentMethod: 'wallet' | 'card' | 'cash';
  createdAt: string;
  customerRating?: number;
  customerReview?: string;
};

export type MerchantReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  orderId?: string;
  productTitle?: string;
  createdAt: string;
  merchantReply?: string;
  isRead: boolean;
};

export type MerchantPromotionType = 'percentage' | 'fixed' | 'bundle';

export type MerchantPromotion = {
  id: string;
  title: string;
  description: string;
  type: MerchantPromotionType;
  value: number;
  productIds: string[];
  minOrderAmount?: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

export type MerchantStore = {
  id: string;
  name: string;
  description: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  revenue: number;
  fulfilledOrders: number;
};

export type MarketplaceState = {
  products: MarketplaceProduct[];
  cart: CartItem[];
  orders: MarketplaceOrder[];
  searchQuery: string;
  merchantStore: MerchantStore;
  promotions: MerchantPromotion[];
  reviews: MerchantReview[];
};

export const MERCHANT_STORE_ID = 'store-you';
