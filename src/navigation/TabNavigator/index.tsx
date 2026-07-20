//* packages import
import React, {Suspense} from 'react';
import {Platform, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeBottomTabNavigator} from '@react-navigation/bottom-tabs/unstable';
import {useTranslation} from 'react-i18next';

//* screens import
import Home from '@screens/home';
import Profile from '@screens/profile';
import ServicesHub from '@screens/servicesHub';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {layout} from '@theme/tokens';
import {useThemeTokens} from '@theme/useThemeTokens';

//* styles import
import {useTabNavigatorStyles} from './styles';
import FloatingTabBar from './FloatingTabBar';

const NativeTab = createNativeBottomTabNavigator<RootStackParamList>();
const JsTab = createBottomTabNavigator<RootStackParamList>();

const TabNavigator = (): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();
  const styles = useTabNavigatorStyles();

  const labels = {
    home: t('tabs.home'),
    services: t('tabs.services'),
    profile: t('tabs.profile'),
  };

  const fallback = (
    <TextView
      text={t('common.loading')}
      style={styles.fallbackText}
      containerStyle={styles.fallback}
    />
  );

  // Android: floating pill detached from edges (native Material bar can't do this).
  // iOS: keep native bottom tabs for Liquid Glass.
  if (Platform.OS === 'android') {
    return (
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <View style={{flex: layout.flex.fill, backgroundColor: colors.background}}>
            <JsTab.Navigator
              initialRouteName="Home"
              tabBar={props => <FloatingTabBar {...props} />}
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                // Transparent absolute bar — content draws underneath the float.
                tabBarStyle: {
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                tabBarBackground: () => null,
                sceneStyle: {
                  backgroundColor: colors.background,
                },
              }}>
              <JsTab.Screen
                name="Home"
                component={Home}
                options={{title: labels.home, tabBarLabel: labels.home}}
              />
              <JsTab.Screen
                name="ServicesHub"
                component={ServicesHub}
                options={{title: labels.services, tabBarLabel: labels.services}}
              />
              <JsTab.Screen
                name="Profile"
                component={Profile}
                options={{title: labels.profile, tabBarLabel: labels.profile}}
              />
            </JsTab.Navigator>
          </View>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <View style={{flex: layout.flex.fill}}>
          <NativeTab.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarBlurEffect: 'systemDefault',
              tabBarActiveIndicatorColor: colors.primaryMuted,
              tabBarActiveIndicatorEnabled: true,
              tabBarLabelVisibilityMode: 'labeled',
            }}>
            <NativeTab.Screen
              name="Home"
              component={Home}
              options={{
                title: labels.home,
                tabBarLabel: labels.home,
                tabBarIcon: {
                  type: 'sfSymbol',
                  name: 'house.fill',
                },
              }}
            />
            <NativeTab.Screen
              name="ServicesHub"
              component={ServicesHub}
              options={{
                title: labels.services,
                tabBarLabel: labels.services,
                tabBarIcon: {
                  type: 'sfSymbol',
                  name: 'square.grid.2x2.fill',
                },
              }}
            />
            <NativeTab.Screen
              name="Profile"
              component={Profile}
              options={{
                title: labels.profile,
                tabBarLabel: labels.profile,
                tabBarIcon: {
                  type: 'sfSymbol',
                  name: 'person.crop.circle.fill',
                },
              }}
            />
          </NativeTab.Navigator>
        </View>
      </Suspense>
    </ErrorBoundary>
  );
};

export default TabNavigator;
