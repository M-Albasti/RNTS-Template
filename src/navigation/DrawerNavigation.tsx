import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Profile from '@screens/profile';
import TabNavigation from './TabNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = (props: any) => {
  console.log("🚀 ~ DrawerNavigation ~ props:", props)
  return (
    <Drawer.Navigator
      id="DrawerRoot"
      backBehavior='history'
      initialRouteName="TabRoot"
      screenOptions={{drawerType: 'slide'}}>
      <Drawer.Group>
        <Drawer.Screen name="TabRoot" options={{title: 'Home'}}>
          {props => <TabNavigation {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {props => <Profile {...props} />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
