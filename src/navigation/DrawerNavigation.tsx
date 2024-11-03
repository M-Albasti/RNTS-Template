import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigation from './TabNavigation';
import Profile from '@screens/profile';
import VideoStackNavigation from './VideoStack';
import AudioStackNavigation from './AudioStack';

const Drawer = createDrawerNavigator();

const DrawerNavigation = (props: any): React.JSX.Element => {
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
        <Drawer.Screen name="AudioStack" options={{title: 'Audios'}}>
          {props => <AudioStackNavigation {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="VideoStack" options={{title: 'Videos'}}>
          {props => <VideoStackNavigation {...props} />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
