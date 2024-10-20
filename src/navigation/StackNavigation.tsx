import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
import Home from '@screens/home';
import Profile from '@screens/profile';
import Settings from '@screens/settings';

const Stack = createNativeStackNavigator();

const StackNavigation = (props: any): React.JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="DrawerRoot">
      <Stack.Group>
        <Stack.Screen name="Home">{props => <Home {...props} />}</Stack.Screen>
        <Stack.Screen name="Profile">
          {props => <Profile {...props} />}
        </Stack.Screen>
        <Stack.Screen name="DrawerRoot">
          {props => <DrawerNavigation {...props} />}
        </Stack.Screen>
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="Settings">
          {props => <Settings {...props} />}
        </Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigation;
