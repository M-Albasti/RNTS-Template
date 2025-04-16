//* packages import
import React, {PropsWithChildren} from 'react';
import {useColorScheme} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

//* components import
import TextView from '@atoms/TextView';

//* services import
import {navigationRef} from '@services/navigationServices/NavigationService';
import {linking} from '@services/linkingServices/deepLinking';

//* hooks import
import {useAppSelector} from '@hooks/useAppSelector';

//* constants import
import {appColors} from '@constants/colors';

//* theme import
import {createMyTheme} from '@theme/appTheme';

//* translation import
import {initLanguage} from '@translation/i18n'; // Import the i18n initialization file

//* styles import
import {styles} from '@navigation/TabNavigator/styles';

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
