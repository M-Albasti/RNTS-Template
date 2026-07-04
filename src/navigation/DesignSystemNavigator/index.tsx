import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DesignSystemHub from '@screens/designSystem/hub';
import {designSystemRegistry} from '@screens/designSystem/registry';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import type {DesignSystemStackParamList} from '@Types/designSystemNavigation';

import {styles} from './styles';

const DesignSystemStack =
  createNativeStackNavigator<DesignSystemStackParamList>();

const DesignSystemNavigator = (): React.JSX.Element => {
  return (
    <DesignSystemStack.Navigator
      initialRouteName="DesignSystemHub"
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
      <DesignSystemStack.Screen
        name="DesignSystemHub"
        component={DesignSystemHub}
      />
      {designSystemRegistry.map(item => (
        <DesignSystemStack.Screen
          key={item.route}
          name={item.route}
          component={item.component}
        />
      ))}
    </DesignSystemStack.Navigator>
  );
};

export default DesignSystemNavigator;
