import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigation from './TabNavigation';
import Profile from '@screens/profile';
import Audio from '@screens/audios';
import Video from '@screens/videos';

const Drawer = createDrawerNavigator();

const DrawerNavigation = (props: any) => {
  return (
    <Drawer.Navigator
      id="DrawerRoot"
      backBehavior="history"
      initialRouteName="TabRoot"
      screenOptions={{drawerType: 'slide', unmountOnBlur: true}}>
      <Drawer.Group>
        <Drawer.Screen name="TabRoot" options={{title: 'Home'}}>
          {props => <TabNavigation {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {props => <Profile {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Audio">
          {props => <Audio {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Video">
          {props => <Video {...props} />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
