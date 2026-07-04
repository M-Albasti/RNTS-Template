//* packages import
import React from 'react';

//* hooks import
import {useMaintenanceMode} from '@hooks/useMaintenanceMode';

//* navigators import
import Navigation from '@navigation/NavigationContainer';
import MainNavigator from '@navigation/MainNavigator';

//* screens import
import MaintenanceModeScreen from '@screens/maintenance';

const NavigationScreens = (): React.JSX.Element => {
  const {isMaintenanceMode, isRefreshing, refresh} = useMaintenanceMode();

  if (isMaintenanceMode) {
    return (
      <MaintenanceModeScreen onRetry={refresh} isRefreshing={isRefreshing} />
    );
  }

  return (
    <Navigation>
      <MainNavigator />
    </Navigation>
  );
};

export default NavigationScreens;
