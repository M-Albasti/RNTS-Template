import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '@screens/home';
import Profile from '@screens/profile';
import StackNavigation from './StackNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
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
        <Tab.Screen
          name="StackRoot"
          options={{
            tabBarIcon: ({focused, color, size}: TabBarIconProps) => {
              return <Ionicons name="list-sharp" size={size} color={color} />;
            },
          }}>
          {props => <StackNavigation {...props} />}
        </Tab.Screen>
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default TabNavigation;
