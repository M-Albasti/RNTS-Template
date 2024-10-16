import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Navigation from './NavigationContainer';
import Home from '@screens/home';
import Profile from '@screens/profile';

const Stack = createNativeStackNavigator();

const NavigationScreens = (): React.JSX.Element => {
  return (
    <Navigation>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">{props => <Home {...props} />}</Stack.Screen>
        <Stack.Screen name="Profile">
          {props => <Profile {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </Navigation>
  );
};

export default NavigationScreens;
