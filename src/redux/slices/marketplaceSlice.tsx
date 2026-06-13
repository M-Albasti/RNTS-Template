import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {
  MARKETPLACE_DELIVERY_FEE,
  SEED_MARKETPLACE_PRODUCTS,
  SEED_MERCHANT_PROMOTIONS,
  SEED_MERCHANT_REVIEWS,
  SEED_MERCHANT_STORE,
} from '@constants/marketplaceMockData';

import {
  getEffectiveProductPrice,
  isProductBuyable,
  recalculateStoreRating,
} from '@helpers/marketplaceHelpers';

import {
  MERCHANT_STORE_ID,
  type CartItem,
  type MarketplaceOrder,
  type MarketplaceProduct,
  type MerchantPromotion,
  type MerchantStore,
} from '@Types/marketplaceTypes';

const initialState = {
  products: SEED_MARKETPLACE_PRODUCTS,
  cart: [] as CartItem[],
  orders: [] as MarketplaceOrder[],
  searchQuery: '',
  merchantStore: SEED_MERCHANT_STORE,
  promotions: SEED_MERCHANT_PROMOTIONS,
  reviews: SEED_MERCHANT_REVIEWS,
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addToCart: (state, action: PayloadAction<{productId: string; quantity?: number}>) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (!product || !isProductBuyable(product)) {
        return;
      }
      const qty = Math.min(action.payload.quantity ?? 1, product.stock);
      const existing = state.cart.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, product.stock);
      } else {
        state.cart.push({productId: action.payload.productId, quantity: qty});
      }
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{productId: string; quantity: number}>,
    ) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      const item = state.cart.find(c => c.productId === action.payload.productId);
      if (!item) {
        return;
      }
      if (action.payload.quantity <= 0) {
        state.cart = state.cart.filter(c => c.productId !== action.payload.productId);
      } else {
        item.quantity = product
          ? Math.min(action.payload.quantity, product.stock)
          : action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    clearCart: state => {
      state.cart = [];
    },
    addProductListing: (state, action: PayloadAction<MarketplaceProduct>) => {
      state.products.unshift({
        ...action.payload,
        merchantId: MERCHANT_STORE_ID,
        isEnabled: action.payload.isEnabled ?? true,
        isOwnListing: true,
      });
    },
    updateProductListing: (
      state,
      action: PayloadAction<{productId: string; updates: Partial<MarketplaceProduct>}>,
    ) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (!product || product.merchantId !== MERCHANT_STORE_ID) {
        return;
      }
      Object.assign(product, action.payload.updates);
    },
    toggleProductEnabled: (state, action: PayloadAction<string>) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product?.merchantId === MERCHANT_STORE_ID) {
        product.isEnabled = !product.isEnabled;
      }
    },
    setProductStock: (state, action: PayloadAction<{productId: string; stock: number}>) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product?.merchantId === MERCHANT_STORE_ID) {
        product.stock = Math.max(0, action.payload.stock);
      }
    },
    markProductOutOfStock: (state, action: PayloadAction<string>) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product?.merchantId === MERCHANT_STORE_ID) {
        product.stock = 0;
      }
    },
    removeProductListing: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.cart = state.cart.filter(c => c.productId !== action.payload);
      state.promotions = state.promotions.map(promo => ({
        ...promo,
        productIds: promo.productIds.filter(id => id !== action.payload),
      }));
    },
    upsertPromotion: (state, action: PayloadAction<MerchantPromotion>) => {
      const index = state.promotions.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        state.promotions[index] = action.payload;
      } else {
        state.promotions.unshift(action.payload);
      }
    },
    togglePromotionActive: (state, action: PayloadAction<string>) => {
      const promo = state.promotions.find(p => p.id === action.payload);
      if (promo) {
        promo.isActive = !promo.isActive;
      }
    },
    removePromotion: (state, action: PayloadAction<string>) => {
      state.promotions = state.promotions.filter(p => p.id !== action.payload);
    },
    updateMerchantStore: (state, action: PayloadAction<Partial<MerchantStore>>) => {
      state.merchantStore = {...state.merchantStore, ...action.payload};
    },
    toggleMerchantStoreOpen: state => {
      state.merchantStore.isOpen = !state.merchantStore.isOpen;
    },
    quickRestockProduct: (state, action: PayloadAction<{productId: string; amount?: number}>) => {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product?.merchantId === MERCHANT_STORE_ID) {
        product.stock += action.payload.amount ?? 10;
      }
    },
    submitCustomerReview: (
      state,
      action: PayloadAction<{orderId: string; rating: number; comment?: string}>,
    ) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (!order || order.customerRating || order.status !== 'delivered') {
        return;
      }

      order.customerRating = action.payload.rating;
      order.customerReview = action.payload.comment?.trim();

      const merchantItem = order.items.find(item => item.merchantId === MERCHANT_STORE_ID);
      const {rating, reviewCount} = recalculateStoreRating(
        state.merchantStore.rating,
        state.merchantStore.reviewCount,
        action.payload.rating,
      );
      state.merchantStore.rating = rating;
      state.merchantStore.reviewCount = reviewCount;

      if (merchantItem) {
        const product = state.products.find(p => p.id === merchantItem.productId);
        if (product?.merchantId === MERCHANT_STORE_ID) {
          const productStats = recalculateStoreRating(
            product.rating,
            product.reviewCount,
            action.payload.rating,
          );
          product.rating = productStats.rating;
          product.reviewCount = productStats.reviewCount;
        }
      }

      state.reviews.unshift({
        id: `rev-${Date.now()}`,
        customerName: 'You',
        rating: action.payload.rating,
        comment: action.payload.comment?.trim() || '',
        orderId: order.id,
        productTitle: merchantItem?.title,
        createdAt: new Date().toISOString(),
        isRead: false,
      });
    },
    respondToMerchantReview: (
      state,
      action: PayloadAction<{reviewId: string; reply: string}>,
    ) => {
      const review = state.reviews.find(r => r.id === action.payload.reviewId);
      if (review) {
        review.merchantReply = action.payload.reply.trim();
        review.isRead = true;
      }
    },
    markReviewRead: (state, action: PayloadAction<string>) => {
      const review = state.reviews.find(r => r.id === action.payload);
      if (review) {
        review.isRead = true;
      }
    },
    markAllReviewsRead: state => {
      state.reviews.forEach(review => {
        review.isRead = true;
      });
    },
    placeMarketplaceOrder: (
      state,
      action: PayloadAction<{
        addressLine: string;
        paymentMethod: MarketplaceOrder['paymentMethod'];
      }>,
    ) => {
      if (state.cart.length === 0 || !state.merchantStore.isOpen) {
        return;
      }

      const items = state.cart
        .map(cartItem => {
          const product = state.products.find(p => p.id === cartItem.productId);
          if (!product || !isProductBuyable(product)) {
            return null;
          }
          const quantity = Math.min(cartItem.quantity, product.stock);
          const unitPrice = getEffectiveProductPrice(product, state.promotions);
          product.stock -= quantity;
          return {
            productId: product.id,
            title: product.title,
            quantity,
            unitPrice,
            merchantId: product.merchantId,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (items.length === 0) {
        return;
      }

      const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

      const order: MarketplaceOrder = {
        id: `mkt-${Date.now()}`,
        items,
        subtotal,
        deliveryFee: MARKETPLACE_DELIVERY_FEE,
        total: subtotal + MARKETPLACE_DELIVERY_FEE,
        status: 'placed',
        addressLine: action.payload.addressLine,
        paymentMethod: action.payload.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      state.orders.unshift(order);
      state.cart = [];
    },
    updateMarketplaceOrderStatus: (
      state,
      action: PayloadAction<{orderId: string; status: MarketplaceOrder['status']}>,
    ) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (!order) {
        return;
      }
      order.status = action.payload.status;
      if (action.payload.status === 'delivered') {
        const merchantTotal = order.items
          .filter(item => item.merchantId === MERCHANT_STORE_ID)
          .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        if (merchantTotal > 0) {
          state.merchantStore.revenue += merchantTotal;
          state.merchantStore.fulfilledOrders += 1;
        }
      }
    },
  },
});

export const {
  setSearchQuery,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  addProductListing,
  updateProductListing,
  toggleProductEnabled,
  setProductStock,
  markProductOutOfStock,
  removeProductListing,
  upsertPromotion,
  togglePromotionActive,
  removePromotion,
  updateMerchantStore,
  toggleMerchantStoreOpen,
  quickRestockProduct,
  submitCustomerReview,
  respondToMerchantReview,
  markReviewRead,
  markAllReviewsRead,
  placeMarketplaceOrder,
  updateMarketplaceOrderStatus,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
