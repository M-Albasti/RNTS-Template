//* packages import
import React, {Suspense} from 'react';
import {Platform, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

//* screens import
import Profile from '@screens/profile';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* navigators import
import TabNavigator from '@navigation/TabNavigator';
import VideoNavigator from '@navigation/VideoNavigator';
import AudioNavigator from '@navigation/AudioNavigator';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* constants import
import {appColors} from '@constants/colors';

//* styles import
import {styles} from './styles';

const Drawer = createDrawerNavigator<RootStackParamList>();

const DrawerNavigator = (props: any): React.JSX.Element => {
  return (
    <Drawer.Navigator
      backBehavior="history"
      initialRouteName="TabRoot"
      layout={({children, state, descriptors, navigation}) => (
        <ErrorBoundary>
          <Suspense
            fallback={
              <TextView
                text={'Loading...'}
                style={styles.fallbackText}
                containerStyle={styles.fallback}
              />
            }>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
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
          {props => <AudioNavigator {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="VideoStack" options={{title: 'Videos'}}>
          {props => <VideoNavigator {...props} />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
