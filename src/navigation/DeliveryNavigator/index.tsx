import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DeliveryHub from '@screens/delivery/deliveryHub';
import NewDelivery from '@screens/delivery/newDelivery';
import ActiveOrders from '@screens/delivery/activeOrders';
import OrderTracking from '@screens/delivery/orderTracking';
import DeliveryHistory from '@screens/delivery/orderHistory';
import DeliveryDetail from '@screens/delivery/deliveryDetail';
import DeliveryDriver from '@screens/delivery/deliveryDriver';
import LiveDeliveryMap from '@screens/delivery/liveDeliveryMap';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const DeliveryStack = createNativeStackNavigator<RootStackParamList>();

const DeliveryNavigator = (): React.JSX.Element => (
  <DeliveryStack.Navigator
    initialRouteName="DeliveryHub"
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
    <DeliveryStack.Screen name="DeliveryHub" component={DeliveryHub} />
    <DeliveryStack.Screen name="NewDelivery" component={NewDelivery} />
    <DeliveryStack.Screen name="ActiveOrders" component={ActiveOrders} />
    <DeliveryStack.Screen name="OrderTracking" component={OrderTracking} />
    <DeliveryStack.Screen name="LiveDeliveryMap" component={LiveDeliveryMap} />
    <DeliveryStack.Screen name="DeliveryHistory" component={DeliveryHistory} />
    <DeliveryStack.Screen name="DeliveryDetail" component={DeliveryDetail} />
    <DeliveryStack.Screen name="DeliveryDriver" component={DeliveryDriver} />
  </DeliveryStack.Navigator>
);

export default DeliveryNavigator;
