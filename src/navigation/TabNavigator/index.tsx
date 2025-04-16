//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';

//* screens import
import Home from '@screens/home';
import Profile from '@screens/profile';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* components import
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* constants import
import {appColors} from '@constants/colors';

//* styles import
import {styles} from './styles';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator<RootStackParamList>();

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
        <ErrorBoundary>
          <Suspense
            fallback={
              <TextView
                text={'Loading...'}
                style={styles.fallbackText}
                containerStyle={styles.fallback}
              />
            }>
            <View style={{flex: 1}}>{children}</View>
          </Suspense>
        </ErrorBoundary>
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
          name="PopUp"
          options={{
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarButton: (props: BottomTabBarButtonProps) => {
              return (
                <TouchableText
                  textStyle={{}}
                  touchableStyle={{
                    ...styles.floatingButtonStyle,
                    borderColor: colors.background,
                  }}
                  text={'hello'}
                  onPress={e => {
                    e.preventDefault();
                  }}
                />
              );
            },
          }}>
          {props => <EmptyComponent />}
        </Tab.Screen>
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
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default TabNavigator;
