//* packages import
import React, {Suspense, useMemo} from 'react';
import {Platform, useWindowDimensions, View} from 'react-native';
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
import DeliveryNavigator from '@navigation/DeliveryNavigator';
import MarketplaceNavigator from '@navigation/MarketplaceNavigator';
import WordPuzzleNavigator from '@navigation/WordPuzzleNavigator';
import IslamicNavigator from '@navigation/IslamicNavigator';

//* types import
import type {DrawerParamList} from '@Types/appNavigation';

import {useThemeTokens} from '@theme/useThemeTokens';

//* styles import
import {styles} from './styles';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = (): React.JSX.Element => {
  const {colors, spacing} = useThemeTokens();
  const {width: windowWidth} = useWindowDimensions();
  const drawerWidth = useMemo(
    () => Math.min(320, Math.max(260, Math.round(windowWidth * 0.82))),
    [windowWidth],
  );

  return (
    <Drawer.Navigator
      backBehavior="history"
      initialRouteName="TabRoot"
      layout={({children}) => (
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
        drawerType: 'front',
        popToTopOnBlur: true,
        headerShown: false,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: colors.background,
          borderTopRightRadius: spacing.lg,
          borderBottomRightRadius: spacing.lg,
          overflow: 'hidden',
        },
        ...Platform.select({
          ios: {
            drawerStatusBarAnimation: 'fade',
            drawerHideStatusBarOnOpen: true,
          },
        }),
        overlayColor: colors.scrim,
      }}
      drawerContent={props => <DrawerMenuContent {...props} />}>
      <Drawer.Group>
        <Drawer.Screen name="TabRoot" options={{title: 'Home'}}>
          {() => <TabNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {props => <Profile {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="AudioStack" options={{title: 'Audios'}}>
          {() => <AudioNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="VideoStack" options={{title: 'Videos'}}>
          {() => <VideoNavigator />}
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
        <Drawer.Screen name="DeliveryStack" options={{title: 'Delivery'}}>
          {() => <DeliveryNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="MarketplaceStack" options={{title: 'Marketplace'}}>
          {() => <MarketplaceNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="WordPuzzleStack" options={{title: 'Word Puzzle'}}>
          {() => <WordPuzzleNavigator />}
        </Drawer.Screen>
        <Drawer.Screen name="IslamicStack" options={{title: 'Islamic'}}>
          {() => <IslamicNavigator />}
        </Drawer.Screen>
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
