import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CameraHub from '@screens/camera/cameraHub';
import SnapCamera from '@screens/camera/snapCamera';
import QrScanner from '@screens/camera/qrScanner';
import BarcodeScanner from '@screens/camera/barcodeScanner';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const CameraStack = createNativeStackNavigator<RootStackParamList>();

const CameraNavigator = (): React.JSX.Element => {
  return (
    <CameraStack.Navigator
      initialRouteName="CameraHub"
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
      <CameraStack.Screen name="CameraHub" component={CameraHub} />
      <CameraStack.Screen
        name="SnapCamera"
        component={SnapCamera}
        options={{animation: 'slide_from_bottom'}}
      />
      <CameraStack.Screen name="QrScanner" component={QrScanner} />
      <CameraStack.Screen name="BarcodeScanner" component={BarcodeScanner} />
    </CameraStack.Navigator>
  );
};

export default CameraNavigator;
