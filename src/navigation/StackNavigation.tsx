import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@screens/home';
import Profile from '@screens/profile';
import DrawerNavigation from './DrawerNavigation';

const Stack = createNativeStackNavigator();

const StackNavigation = (props: any): React.JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="DrawerRoot">
      <Stack.Screen name="Home">{props => <Home {...props} />}</Stack.Screen>
      <Stack.Screen name="Profile">
        {props => <Profile {...props} />}
      </Stack.Screen>
      <Stack.Screen name="DrawerRoot">
        {props => <DrawerNavigation {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigation;
