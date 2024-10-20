import React from 'react';
import {
  DarkTheme, // used with dark mode app
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {navigationRef} from '@services/NavigationServices';
import {Text} from 'react-native';
import {linking} from '@services/deepLinking';

const Navigation = ({children}: React.JSX.Element | any): React.JSX.Element => {
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={DefaultTheme}
      linking={linking}
      fallback={<Text>Loading...</Text>}>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
