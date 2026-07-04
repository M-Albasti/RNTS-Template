# Delivery & Marketplace Modules

Two full drawer modules inspired by **Uber** (on-demand delivery + live map tracking) and **Talabat** (multi-category marketplace, cart, checkout, sell listings).

Both modules use **Redux** for local demo state (MMKV-persisted with the rest of the app). No backend is required to explore flows; swap mock data for API clients when you connect a real server.

---

## Quick access

| Entry | Path |
|-------|------|
| Drawer menu | **Delivery** · **Marketplace** |
| Home hub cards | Delivery · Marketplace module tiles |
| Delivery hub | `DeliveryStack` → `DeliveryHub` |
| Marketplace hub | `MarketplaceStack` → `MarketplaceHub` |

---

## Delivery module (Uber-style)

### Features

| Screen | Route | Description |
|--------|-------|-------------|
| Hub | `DeliveryHub` | Overview, active count, shortcuts |
| New delivery | `NewDelivery` | Pickup/dropoff, package type, price quote |
| Active orders | `ActiveOrders` | In-progress deliveries |
| Live tracking | `OrderTracking` | **Map**, courier marker, route polyline, timeline, live ETA card |
| Full-screen map | `LiveDeliveryMap` | Immersive live map for customer or driver |
| History | `DeliveryHistory` | Completed / cancelled |
| Order detail | `DeliveryDetail` | Full order breakdown |
| Courier panel | `DeliveryDriver` | Driver mode, accept jobs, update status |

### Map & location

- **`react-native-maps`** — `DeliveryMap` molecule (`src/components/molecules/maps/DeliveryMap.tsx`)
- **`@react-native-community/geolocation`** — user location via `locationHelpers.ts` + `useUserLocation`
- **`LocationPermissionGate`** — prompts for location (Android + iOS)
- **Live tracking** — `useLiveDeliveryTracking` + `LiveTrackingCard`:
- **Customer** — polls `GET /delivery/orders/:id/tracking` every 5 seconds (only while screen is focused)
- **Driver** — posts real GPS to `POST /delivery/orders/:id/driver-location` every ~5 seconds

### Customer flow

1. **New delivery** → select addresses → get ETA/price → confirm  
2. **Active orders** → tap order → **Track on map** (live badge when courier is moving)  
3. Pending orders → wait for a courier to accept on the server  
4. **Open live map** — full-screen tracking view (location from server polls)

### Courier flow (driver panel)

1. Enable **Courier mode** + **Available for jobs**  
2. Tap an open job to accept (syncs to server)  
3. Update: **Picked up** → **Start delivery** → real GPS is posted to the server  
4. **Enable background tracking** — required on Android/iOS so location keeps updating when the app is minimized  
5. **Open live map** — full-screen navigation-style view

### Redux (`delivery` slice)

```
src/redux/slices/deliverySlice.tsx
src/types/deliveryTypes.tsx
src/constants/deliveryMockData.ts   ← seed orders & Dubai-area addresses
```

Key actions: `createDeliveryOrder`, `assignDriverToOrder`, `updateOrderStatus`, `updateDriverLocation`, `cancelDeliveryOrder`, `acceptDriverJob`, `setDriverMode`, `setDriverAvailable`

---

## Marketplace module (Talabat-style)

### Features

| Screen | Route | Description |
|--------|-------|-------------|
| Hub | `MarketplaceHub` | Categories, search entry, shortcuts |
| Categories | `MarketplaceCategories` | All verticals (food, grocery, pharmacy, …) |
| Products | `MarketplaceProducts` | Grid by category or search |
| Product detail | `MarketplaceProductDetail` | Qty, add to cart, buy now |
| Cart | `MarketplaceCart` | Edit quantities, subtotal + delivery fee |
| Checkout | `MarketplaceCheckout` | Address, payment (wallet / card / COD) |
| My orders | `MarketplaceOrders` | Purchase history |
| Order detail | `MarketplaceOrderDetail` | Items, status (demo advance button) |
| Sell item | `MarketplaceSell` | Publish your own listing |
| My listings | `MarketplaceMyListings` | Manage / remove listings |
| Search | `MarketplaceSearch` | Full-text product search |

### Buy flow

1. Browse category or search → **Product detail**  
2. **Add to cart** → **Cart** → **Checkout**  
3. Choose payment → **Place order** (wallet deducts via `wallet` slice when selected)  

### Sell flow

1. **Sell item** → title, description, price, stock, category  
2. Listing appears in catalog with `isOwnListing: true`  
3. **My listings** → remove when needed  

### Redux (`marketplace` slice)

```
src/redux/slices/marketplaceSlice.tsx
src/types/marketplaceTypes.tsx
src/constants/marketplaceMockData.ts
src/helpers/marketplaceHelpers.ts
```

Key actions: `addToCart`, `updateCartQuantity`, `placeMarketplaceOrder`, `addProductListing`, `removeProductListing`, `setSearchQuery`

### Merchant portal (Talabat Partner / Uber Eats Manager style)

Open **Merchant portal** from Marketplace hub or **My listings**.

| Screen | Features |
|--------|----------|
| **Merchant hub** | Dashboard stats (active products, out of stock, pending orders, revenue) |
| **Catalog** | Add/edit products, enable/disable toggle, mark out of stock, delete |
| **Promotions** | Create percentage/fixed/bundle offers, pause/activate, apply to products or store-wide |
| **Incoming orders** | View orders containing your items, advance status (placed → delivered), cancel |
| **Store settings** | Open/close store (blocks checkout when closed), edit name & description |

Merchant Redux actions: `updateProductListing`, `toggleProductEnabled`, `setProductStock`, `markProductOutOfStock`, `upsertPromotion`, `togglePromotionActive`, `removePromotion`, `updateMerchantStore`, `toggleMerchantStoreOpen`, `updateMarketplaceOrderStatus`

Buyer-side: disabled/out-of-stock products hidden from browse; promo prices shown on cards and detail; stock decrements on order placement.

---

## Navigation wiring

```
DrawerNavigator
├── DeliveryStack → DeliveryNavigator
└── MarketplaceStack → MarketplaceNavigator
```

Types: `src/types/appNavigation.tsx` (`DrawerParamList` + `RootStackParamList`)

---

## Native setup (maps)

### Android

1. Enable **Maps SDK for Android** in [Google Cloud Console](https://console.cloud.google.com/)  
2. Copy `.env.example` → `.env` (if needed) and set your key:

```env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Gradle reads this value at build time via `android/loadEnv.gradle` and injects it into `AndroidManifest.xml` as `@string/google_maps_api_key`.

3. Permissions in `AndroidManifest.xml`:
   - `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`
   - `ACCESS_BACKGROUND_LOCATION` (driver background tracking via JS geolocation)
   - `com.google.android.geo.API_KEY` meta-data

4. Rebuild after changing `.env`: `bun run android`

### iOS

1. Location usage strings in `Info.plist` (`NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`)  
2. `UIBackgroundModes` → `location` for driver background tracking  
3. **Google Maps** — set `GOOGLE_MAPS_API_KEY` in `.env`, enable **Maps SDK for iOS**, then run `pod install` (Podfile syncs `GMSApiKey` into `Info.plist` and links the `GoogleMaps` pod)  
4. Run `cd ios && pod install && cd ..` then `bun run ios`  
5. On the **Courier panel**, tap **Enable background tracking** and choose **Always** when iOS prompts

### Live location API (driver → server → customer)

| Method | Endpoint | Role |
|--------|----------|------|
| `POST` | `/delivery/orders/:id/driver-location` | Driver sends GPS every ~5s (real device location) |
| `GET` | `/delivery/orders/:id/tracking` | Customer polls every 5s for courier position |
| `PATCH` | `/delivery/orders/:id/status` | Driver updates picked up / in transit / delivered |
| `POST` | `/delivery/orders/:id/accept` | Driver accepts a pending job |

With `API_USE_MOCKS=true`, mock handlers in `src/api/mocks/deliveryMocks.ts` simulate the backend in memory. Set `API_USE_MOCKS=false` and point `API_BASE_URL` at your real API implementing the same routes.

There is **no simulated/fake courier movement** — the map only updates from real GPS posts (driver) or server polling (customer).

---

## Translations

Namespaces in `src/translation/en/index.json` and `ar/index.json`:

- `drawer.delivery`, `drawer.marketplace`
- `delivery.*` — all delivery UI strings + status labels
- `marketplace.*` — catalog, cart, checkout, sell, order statuses, **merchant portal** (catalog CRUD, promotions, incoming orders, store open/close)
- `home.modules.delivery`, `home.modules.marketplace`

---

## File structure

```
src/
├── navigation/
│   ├── DeliveryNavigator/
│   └── MarketplaceNavigator/
├── screens/
│   ├── delivery/          ← 8 screens (incl. LiveDeliveryMap)
│   └── marketplace/       ← 11 buyer screens + merchant/ (8 screens)
├── components/molecules/
│   ├── maps/              ← DeliveryMap, LocationPermissionGate
│   ├── delivery/          ← OrderStatusBadge, DeliveryTimeline, LiveTrackingCard
│   └── marketplace/       ← ProductCard, MerchantStatCard, PromotionCard, ProductStatusBadge
├── redux/slices/
│   ├── deliverySlice.tsx
│   └── marketplaceSlice.tsx
├── hooks/
│   ├── useUserLocation.tsx
│   ├── useLiveDeliveryTracking.tsx
│   └── useDriverBackgroundTracking.tsx
├── services/deliveryServices/
│   └── driverLocationEngine.ts
├── helpers/
│   ├── locationHelpers.ts
│   ├── deliveryTrackingHelpers.ts
│   └── marketplaceHelpers.ts
├── constants/
│   ├── deliveryMockData.ts
│   └── marketplaceMockData.ts
└── types/
    ├── deliveryTypes.tsx
    └── marketplaceTypes.tsx
```

---

## Connecting a real backend

Follow the existing API pattern (`src/api/clients/`, React Query hooks):

1. **Delivery** — REST endpoints for create order, list orders, courier location WebSocket or polling  
2. **Marketplace** — catalog API, cart sync, checkout payment intent, seller inventory  

Keep Redux for optimistic UI or migrate cart/orders to React Query + MMKV cache.

---

## Demo tips

- **Delivery map**: open seeded order `del-1001` (already in transit) or create a new order and simulate courier  
- **Driver mode**: accept a pending job from **Courier panel**  
- **Marketplace wallet pay**: ensure Wallet balance ≥ order total (`wallet` slice default: AED 2480.50 equivalent in USD display)  
- **RTL**: switch to Arabic in Settings — all new strings support AR  

---

## Dependencies added

```json
"react-native-maps": "^1.27.2",
"@react-native-community/geolocation": "^3.4.0"
```

After `pod install` (iOS) and a native rebuild, both modules are ready to use.
