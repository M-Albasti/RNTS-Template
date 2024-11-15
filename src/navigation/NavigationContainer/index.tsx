import React, {PropsWithChildren} from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {navigationRef} from '@services/NavigationServices';
import {useColorScheme} from 'react-native';
import {linking} from '@services/deepLinking';
import {createMyTheme} from '@theme/appTheme';
import {appColors} from '@constants/colors';
import TextView from '@atoms/TextView';
import {styles} from '@navigation/TabNavigator/styles';

const Navigation = ({children}: PropsWithChildren): React.JSX.Element => {
  const scheme = useColorScheme();
  const theme = createMyTheme(
    scheme === 'dark' ? DarkTheme : DefaultTheme,
    appColors.primary,
    scheme === 'dark' ? appColors.black : appColors.white,
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      linking={linking}
      fallback={
        <TextView
          text={'Loading...'}
          style={styles.fallbackText}
          containerStyle={styles.fallback}
        />
      }>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
