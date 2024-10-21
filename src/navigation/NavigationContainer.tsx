import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {navigationRef} from '@services/NavigationServices';
import {Text, useColorScheme} from 'react-native';
import {linking} from '@services/deepLinking';
import {createMyTheme} from '@services/appTheme';
import {appColors} from '@constants/colors';

const Navigation = ({children}: React.JSX.Element | any): React.JSX.Element => {
  const scheme = useColorScheme();
  const theme = createMyTheme(
    scheme === 'dark' ? DarkTheme : DefaultTheme,
    appColors.primary,
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      linking={linking}
      fallback={<Text>Loading...</Text>}>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
