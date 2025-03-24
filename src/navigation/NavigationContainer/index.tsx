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
import {useAppSelector} from '@hooks/useAppSelector';
import {initLanguage} from '@translation/i18n'; // Import the i18n initialization file

const Navigation = ({children}: PropsWithChildren): React.JSX.Element => {
  const scheme = useColorScheme();
  const theme = createMyTheme(
    scheme === 'dark' ? DarkTheme : DefaultTheme,
    appColors.primary,
    scheme === 'dark' ? appColors.black : appColors.white,
  );
  const lang = useAppSelector(state => state?.appSettings?.lang);

  const onReady = () => {
    initLanguage(lang);
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      onReady={onReady}
      onUnhandledAction={error => {
        console.log('Error Navigation =>', error);
      }}
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
