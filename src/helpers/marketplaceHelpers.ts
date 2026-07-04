import type {MarketplaceState} from '@Types/marketplaceTypes';
import {
  MERCHANT_STORE_ID,
  type MarketplaceOrder,
  type MarketplaceProduct,
  type MerchantPromotion,
  type MerchantReview,
} from '@Types/marketplaceTypes';

export const getCartItemCount = (cart: MarketplaceState['cart']): number =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

export const isProductBuyable = (product: MarketplaceProduct): boolean =>
  product.isEnabled && product.stock > 0;

export const getProductAvailabilityLabel = (
  product: MarketplaceProduct,
): 'in_stock' | 'out_of_stock' | 'disabled' => {
  if (!product.isEnabled) {
    return 'disabled';
  }
  if (product.stock <= 0) {
    return 'out_of_stock';
  }
  return 'in_stock';
};

export const getMerchantProducts = (products: MarketplaceProduct[]): MarketplaceProduct[] =>
  products.filter(p => p.merchantId === MERCHANT_STORE_ID || p.isOwnListing);

export const getOwnListings = (products: MarketplaceProduct[]): MarketplaceProduct[] =>
  getMerchantProducts(products);

export const getActivePromotions = (
  promotions: MerchantPromotion[],
  now = Date.now(),
): MerchantPromotion[] =>
  promotions.filter(promo => {
    if (!promo.isActive) {
      return false;
    }
    const start = new Date(promo.startsAt).getTime();
    const end = new Date(promo.endsAt).getTime();
    return now >= start && now <= end;
  });

export const getPromotionForProduct = (
  productId: string,
  promotions: MerchantPromotion[],
): MerchantPromotion | undefined =>
  getActivePromotions(promotions).find(
    promo => promo.productIds.length === 0 || promo.productIds.includes(productId),
  );

export const getEffectiveProductPrice = (
  product: MarketplaceProduct,
  promotions: MerchantPromotion[],
): number => {
  const promo = getPromotionForProduct(product.id, promotions);
  if (!promo) {
    return product.price;
  }
  if (promo.type === 'percentage') {
    return Math.round(product.price * (1 - promo.value / 100) * 100) / 100;
  }
  if (promo.type === 'fixed') {
    return Math.max(0, Math.round((product.price - promo.value) * 100) / 100);
  }
  return product.price;
};

export const getCartLines = (
  cart: MarketplaceState['cart'],
  products: MarketplaceProduct[],
  promotions: MerchantPromotion[] = [],
) =>
  cart
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product || !isProductBuyable(product)) {
        return null;
      }
      const unitPrice = getEffectiveProductPrice(product, promotions);
      return {product, quantity: item.quantity, lineTotal: unitPrice * item.quantity, unitPrice};
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

export const getCartSubtotal = (
  cart: MarketplaceState['cart'],
  products: MarketplaceProduct[],
  promotions: MerchantPromotion[] = [],
): number =>
  getCartLines(cart, products, promotions).reduce((sum, line) => sum + line.lineTotal, 0);

export const filterProducts = (
  products: MarketplaceProduct[],
  options: {categoryId?: string; searchQuery?: string; includeDisabled?: boolean},
): MarketplaceProduct[] => {
  let result = products;
  if (!options.includeDisabled) {
    result = result.filter(isProductBuyable);
  }
  if (options.categoryId) {
    result = result.filter(p => p.categoryId === options.categoryId);
  }
  if (options.searchQuery?.trim()) {
    const q = options.searchQuery.trim().toLowerCase();
    result = result.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q),
    );
  }
  return result;
};

export const getMerchantOrders = (orders: MarketplaceOrder[]): MarketplaceOrder[] =>
  orders.filter(order =>
    order.items.some(item => item.merchantId === MERCHANT_STORE_ID),
  );

export const getMerchantOrderItems = (order: MarketplaceOrder) =>
  order.items.filter(item => item.merchantId === MERCHANT_STORE_ID);

export const getMerchantOrderTotal = (order: MarketplaceOrder): number =>
  getMerchantOrderItems(order).reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

export const recalculateStoreRating = (
  currentRating: number,
  currentCount: number,
  newRating: number,
): {rating: number; reviewCount: number} => {
  const reviewCount = currentCount + 1;
  const rating = Math.round(((currentRating * currentCount + newRating) / reviewCount) * 10) / 10;
  return {rating, reviewCount};
};

export const getMerchantReviews = (reviews: MarketplaceState['reviews']): MerchantReview[] =>
  [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const getUnreadReviewCount = (reviews: MarketplaceState['reviews']): number =>
  reviews.filter(review => !review.isRead).length;

export const getLowStockProducts = (
  products: MarketplaceProduct[],
  threshold = 5,
): MarketplaceProduct[] =>
  getMerchantProducts(products).filter(
    product => product.isEnabled && product.stock > 0 && product.stock <= threshold,
  );

export const getRecentMerchantOrders = (
  orders: MarketplaceOrder[],
  limit = 3,
): MarketplaceOrder[] =>
  getMerchantOrders(orders)
    .filter(order => !['delivered', 'cancelled'].includes(order.status))
    .slice(0, limit);

export const getAverageProductRating = (products: MarketplaceProduct[]): number => {
  const merchantProducts = getMerchantProducts(products);
  if (merchantProducts.length === 0) {
    return 0;
  }
  const total = merchantProducts.reduce((sum, product) => sum + product.rating, 0);
  return Math.round((total / merchantProducts.length) * 10) / 10;
};

export const getMerchantStats = (
  products: MarketplaceProduct[],
  orders: MarketplaceOrder[],
  promotions: MerchantPromotion[],
  reviews: MerchantReview[] = [],
) => {
  const merchantProducts = getMerchantProducts(products);
  const merchantOrders = getMerchantOrders(orders);
  const activeOrders = merchantOrders.filter(
    o => !['delivered', 'cancelled'].includes(o.status),
  ).length;

  return {
    totalProducts: merchantProducts.length,
    activeProducts: merchantProducts.filter(p => p.isEnabled && p.stock > 0).length,
    outOfStock: merchantProducts.filter(p => p.isEnabled && p.stock <= 0).length,
    disabledProducts: merchantProducts.filter(p => !p.isEnabled).length,
    activePromotions: getActivePromotions(promotions).length,
    pendingOrders: activeOrders,
    unreadReviews: getUnreadReviewCount(reviews),
    averageProductRating: getAverageProductRating(products),
    lowStockCount: getLowStockProducts(products).length,
    revenue: merchantOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + getMerchantOrderTotal(o), 0),
  };
};

export const MERCHANT_ORDER_STATUS_FLOW: MarketplaceOrder['status'][] = [
  'placed',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
];

export const getNextMerchantOrderStatus = (
  status: MarketplaceOrder['status'],
): MarketplaceOrder['status'] | null => {
  const index = MERCHANT_ORDER_STATUS_FLOW.indexOf(status);
  if (index < 0 || index >= MERCHANT_ORDER_STATUS_FLOW.length - 1) {
    return null;
  }
  return MERCHANT_ORDER_STATUS_FLOW[index + 1];
};
