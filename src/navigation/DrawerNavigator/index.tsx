import React, {Suspense} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from '../TabNavigator';
import Profile from '@screens/profile';
import VideoStackNavigator from '../VideoStack';
import AudioStackNavigator from '../AudioStack';
import {appColors} from '@constants/colors';
import {Platform, Text, View} from 'react-native';
import {styles} from './styles';

const Drawer = createDrawerNavigator();

const DrawerNavigator = (props: any): React.JSX.Element => {
  return (
    <Drawer.Navigator
      backBehavior="history"
      initialRouteName="TabRoot"
      layout={({children, state, descriptors, navigation}) => (
        <Suspense
          fallback={
            <View style={styles.fallback}>
              <Text style={styles.fallbackText}>Loading…</Text>
            </View>
          }>
          <View style={styles.container}>{children}</View>
        </Suspense>
      )}
      screenOptions={{
        drawerType: 'slide',
        popToTopOnBlur: true,
        ...Platform.select({
          ios: {
            drawerStatusBarAnimation: 'fade',
            drawerHideStatusBarOnOpen: true,
          },
        }),
        overlayColor: appColors.black40,
      }}>
      <Drawer.Group>
        <Drawer.Screen name="TabRoot" options={{title: 'Home'}}>
          {props => <TabNavigator {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {props => <Profile {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="AudioStack" options={{title: 'Audios'}}>
          {props => <AudioStackNavigator {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="VideoStack" options={{title: 'Videos'}}>
          {props => <VideoStackNavigator {...props} />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
