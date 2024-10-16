import React from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './NavigationServices';

const Navigation = ({children}: React.JSX.Element | any): React.JSX.Element => {
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={DefaultTheme}>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
