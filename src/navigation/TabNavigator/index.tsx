import {layout} from '@theme/tokens';

//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

//* screens import
import Home from '@screens/home';
import Profile from '@screens/profile';
import ServicesHub from '@screens/servicesHub';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* components import
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {useThemeTokens} from '@theme/useThemeTokens';

//* styles import
import {useTabNavigatorStyles} from './styles';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator<RootStackParamList>();

const TabNavigator = (props: any): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {colors: themeColors} = useThemeTokens();
  const styles = useTabNavigatorStyles();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        animation: 'fade',
        tabBarStyle: styles.tabBarStyle,
      }}
      layout={({children, state, descriptors, navigation}) => (
        <ErrorBoundary>
          <Suspense
            fallback={
              <TextView
                text={t('common.loading')}
                style={styles.fallbackText}
                containerStyle={styles.fallback}
              />
            }>
            <View style={{flex: layout.flex.fill}}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}>
      <Tab.Group>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: t('tabs.home'),
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="home"
                  size={size + 5}
                  color={focused ? themeColors.textPrimary : themeColors.textInverse}
                  iconContainerStyle={
                    focused
                      ? {
                          ...styles.iconContainerStyle,
                          backgroundColor: colors.primary,
                        }
                      : styles.iconContainerStyle
                  }
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="ServicesHub"
          component={ServicesHub}
          options={{
            tabBarLabel: t('tabs.services'),
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="grid"
                  size={size + 5}
                  color={focused ? themeColors.textPrimary : themeColors.textInverse}
                  iconContainerStyle={
                    focused
                      ? {
                          ...styles.iconContainerStyle,
                          backgroundColor: colors.primary,
                        }
                      : styles.iconContainerStyle
                  }
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: t('tabs.profile'),
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="person-circle-sharp"
                  size={size + 5}
                  color={focused ? themeColors.textPrimary : themeColors.textInverse}
                  iconContainerStyle={
                    focused
                      ? {
                          ...styles.iconContainerStyle,
                          backgroundColor: colors.primary,
                        }
                      : styles.iconContainerStyle
                  }
                />
              );
            },
          }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default TabNavigator;
