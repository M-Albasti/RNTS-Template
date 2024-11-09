import React, {Suspense} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Home from '@screens/home';
import Profile from '@screens/profile';
import {useTheme} from '@react-navigation/native';
import IconView from '@atoms/Icon';
import {styles} from './styles';
import {appColors} from '@constants/colors';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator();

const TabNavigator = (props: any): React.JSX.Element => {
  const {colors} = useTheme();

  const EmptyComponent = () => {
    return <View />;
  };

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
        <Suspense
          fallback={
            <View style={styles.fallback}>
              <Text style={styles.fallbackText}>Loading…</Text>
            </View>
          }>
          <View style={{flex: 1}}>{children}</View>
        </Suspense>
      )}>
      <Tab.Group>
        <Tab.Screen
          name="Home"
          options={{
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="home"
                  size={size + 5}
                  color={focused ? appColors.black : appColors.white}
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
          }}>
          {props => <Home {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Home1"
          options={{
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="home"
                  size={size + 5}
                  color={focused ? appColors.black : appColors.white}
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
          }}>
          {props => <Home {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="PopUp"
          component={EmptyComponent}
          options={{
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarButton: (props: BottomTabBarButtonProps) => {
              return (
                <TouchableOpacity
                  // {...props}
                  style={{
                    ...styles.floatingButtonStyle,
                    borderColor: colors.background,
                  }}
                  onPress={e => {
                    e.preventDefault();
                    console.log('we are here !!');
                  }}>
                  <Text>hello</Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          options={{
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="person-circle-sharp"
                  size={size + 5}
                  color={focused ? appColors.black : appColors.white}
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
          }}>
          {props => <Profile {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile1"
          options={{
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <IconView
                  iconType={'Ionicons'}
                  name="person-circle-sharp"
                  size={size + 5}
                  color={focused ? appColors.black : appColors.white}
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
          }}>
          {props => <Profile {...props} />}
        </Tab.Screen>
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default TabNavigator;
