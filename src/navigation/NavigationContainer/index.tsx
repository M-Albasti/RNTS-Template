//* packages import
import React, {PropsWithChildren, useCallback} from 'react';
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
import {useAppColorScheme} from '@hooks/useAppColorScheme';
import {useAppSelector} from '@hooks/useAppSelector';

//* navigators import
import {navigationIntegration} from '@navigation/navigationIntegration';

//* theme import
import {createNavigationTheme} from '@theme/appTheme';

//* translation import
import {syncLanguage} from '@translation/i18n';

//* utils import
import {logger} from '@utils/logger';

//* styles import
import {navigationFallbackStyles} from '@navigation/TabNavigator/styles';

const Navigation = ({children}: PropsWithChildren): React.JSX.Element => {
  const scheme = useAppColorScheme();
  const theme = createNavigationTheme(
    scheme === 'dark' ? DarkTheme : DefaultTheme,
    scheme,
  );
  const lang = useAppSelector(state => state?.appSettings?.lang);

  const onNavigationReady = useCallback(() => {
    navigationIntegration.registerNavigationContainer(navigationRef);
    syncLanguage(lang);
  }, [lang]);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      onReady={onNavigationReady}
      onUnhandledAction={error => {
        logger.warn('Unhandled navigation action:', error);
      }}
      linking={linking}
      fallback={
        <TextView
          text={'Loading...'}
          style={navigationFallbackStyles.fallbackText}
          containerStyle={navigationFallbackStyles.fallback}
        />
      }>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
