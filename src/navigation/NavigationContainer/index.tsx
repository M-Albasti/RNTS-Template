import React, {PropsWithChildren} from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {navigationRef} from '@services/NavigationServices';
import {Text, View, useColorScheme} from 'react-native';
import {linking} from '@services/deepLinking';
import {createMyTheme} from '@theme/appTheme';
import {appColors} from '@constants/colors';

const Navigation = ({children}: PropsWithChildren): React.JSX.Element => {
  const scheme = useColorScheme();
  const theme = createMyTheme(
    scheme === 'dark' ? DarkTheme : DefaultTheme,
    appColors.primary,
    appColors.white,
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      linking={linking}
      fallback={
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 25}}>Loading...</Text>
        </View>
      }>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
