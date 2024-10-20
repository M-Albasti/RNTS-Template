import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '@screens/home';
import Profile from '@screens/profile';

const Drawer = createDrawerNavigator();

const DrawerNavigation = (props: any) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{drawerType: 'slide'}}>
      <Drawer.Group>
        <Drawer.Screen name="Home">
          {props => <Home {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {props => <Profile {...props} />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
