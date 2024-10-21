import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '@screens/home';
import Profile from '@screens/profile';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator();

const TabNavigation = (props: any) => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Tab.Group>
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return <Ionicons name="home" size={size} color={color} />;
            },
          }}>
          {props => <Home {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={{
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return (
                <Ionicons
                  name="person-circle-sharp"
                  size={size}
                  color={color}
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

export default TabNavigation;
