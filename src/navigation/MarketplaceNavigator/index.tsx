import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MarketplaceHub from '@screens/marketplace/marketplaceHub';
import MarketplaceCategories from '@screens/marketplace/marketplaceCategories';
import MarketplaceProducts from '@screens/marketplace/marketplaceProducts';
import MarketplaceProductDetail from '@screens/marketplace/marketplaceProductDetail';
import MarketplaceCart from '@screens/marketplace/marketplaceCart';
import MarketplaceCheckout from '@screens/marketplace/marketplaceCheckout';
import MarketplaceOrders from '@screens/marketplace/marketplaceOrders';
import MarketplaceOrderDetail from '@screens/marketplace/marketplaceOrderDetail';
import MarketplaceSell from '@screens/marketplace/marketplaceSell';
import MarketplaceMyListings from '@screens/marketplace/marketplaceMyListings';
import MarketplaceSearch from '@screens/marketplace/marketplaceSearch';
import MerchantHub from '@screens/marketplace/merchant/merchantHub';
import MerchantProducts from '@screens/marketplace/merchant/merchantProducts';
import MerchantEditProduct from '@screens/marketplace/merchant/merchantEditProduct';
import MerchantPromotions from '@screens/marketplace/merchant/merchantPromotions';
import MerchantEditPromotion from '@screens/marketplace/merchant/merchantEditPromotion';
import MerchantOrders from '@screens/marketplace/merchant/merchantOrders';
import MerchantOrderDetail from '@screens/marketplace/merchant/merchantOrderDetail';
import MerchantStoreSettings from '@screens/marketplace/merchant/merchantStoreSettings';
import MerchantReviews from '@screens/marketplace/merchant/merchantReviews';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const MarketplaceStack = createNativeStackNavigator<RootStackParamList>();

const MarketplaceNavigator = (): React.JSX.Element => (
  <MarketplaceStack.Navigator
    initialRouteName="MarketplaceHub"
    layout={({children}) => (
      <ErrorBoundary>
        <Suspense
          fallback={
            <TextView
              text="Loading..."
              style={styles.fallbackText}
              containerStyle={styles.fallback}
            />
          }>
          <View style={styles.container}>{children}</View>
        </Suspense>
      </ErrorBoundary>
    )}
    screenOptions={{headerShown: false}}>
    <MarketplaceStack.Screen name="MarketplaceHub" component={MarketplaceHub} />
    <MarketplaceStack.Screen name="MarketplaceCategories" component={MarketplaceCategories} />
    <MarketplaceStack.Screen name="MarketplaceProducts" component={MarketplaceProducts} />
    <MarketplaceStack.Screen name="MarketplaceProductDetail" component={MarketplaceProductDetail} />
    <MarketplaceStack.Screen name="MarketplaceCart" component={MarketplaceCart} />
    <MarketplaceStack.Screen name="MarketplaceCheckout" component={MarketplaceCheckout} />
    <MarketplaceStack.Screen name="MarketplaceOrders" component={MarketplaceOrders} />
    <MarketplaceStack.Screen name="MarketplaceOrderDetail" component={MarketplaceOrderDetail} />
    <MarketplaceStack.Screen name="MarketplaceSell" component={MarketplaceSell} />
    <MarketplaceStack.Screen name="MarketplaceMyListings" component={MarketplaceMyListings} />
    <MarketplaceStack.Screen name="MarketplaceSearch" component={MarketplaceSearch} />
    <MarketplaceStack.Screen name="MerchantHub" component={MerchantHub} />
    <MarketplaceStack.Screen name="MerchantProducts" component={MerchantProducts} />
    <MarketplaceStack.Screen name="MerchantEditProduct" component={MerchantEditProduct} />
    <MarketplaceStack.Screen name="MerchantPromotions" component={MerchantPromotions} />
    <MarketplaceStack.Screen name="MerchantEditPromotion" component={MerchantEditPromotion} />
    <MarketplaceStack.Screen name="MerchantOrders" component={MerchantOrders} />
    <MarketplaceStack.Screen name="MerchantOrderDetail" component={MerchantOrderDetail} />
    <MarketplaceStack.Screen name="MerchantStoreSettings" component={MerchantStoreSettings} />
    <MarketplaceStack.Screen name="MerchantReviews" component={MerchantReviews} />
  </MarketplaceStack.Navigator>
);

export default MarketplaceNavigator;
