//* packages import
import React, {Suspense} from 'react';
import {Platform, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import DrawerMenuContent from '@organisms/drawer/DrawerMenuContent';

//* screens import
import Profile from '@screens/profile';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* navigators import
import TabNavigator from '@navigation/TabNavigator';
import VideoNavigator from '@navigation/VideoNavigator';
import AudioNavigator from '@navigation/AudioNavigator';
import PostNavigator from '@navigation/PostNavigator';
import TodoNavigator from '@navigation/TodoNavigator';
import ChatNavigator from '@navigation/ChatNavigator';
import GameNavigator from '@navigation/GameNavigator';
import WalletNavigator from '@navigation/WalletNavigator';
import GalleryNavigator from '@navigation/GalleryNavigator';
import DesignSystemNavigator from '@navigation/DesignSystemNavigator';
import CameraNavigator from '@navigation/CameraNavigator';

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
        headerShown: false,
        ...Platform.select({
          ios: {
            drawerStatusBarAnimation: 'fade',
            drawerHideStatusBarOnOpen: true,
          },
        }),
        overlayColor: appColors.black40,
      }}
      drawerContent={props => <DrawerMenuContent {...props} />}>
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
        <Drawer.Screen name="PostStack" options={{title: 'Social Feed'}}>
          {() => <PostNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="TodoStack" options={{title: 'Todo List'}}>
          {() => <TodoNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="ChatStack" options={{title: 'Chat'}}>
          {() => <ChatNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="GameStack" options={{title: 'Lucky Spinner'}}>
          {() => <GameNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="WalletStack" options={{title: 'Wallet'}}>
          {() => <WalletNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="GalleryStack" options={{title: 'Gallery'}}>
          {() => <GalleryNavigator />}
        </Drawer.Screen>
        <Drawer.Screen
          name="DesignSystemStack"
          options={{title: 'Design System'}}>
          {() => <DesignSystemNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="CameraStack" options={{title: 'Camera'}}>
          {() => <CameraNavigator />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
