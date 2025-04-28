//* packages import
import React from 'react';

//* navigators import
import Navigation from './NavigationContainer';
import MainNavigator from './MainNavigator';

const NavigationScreens = (): React.JSX.Element => {
  return (
    <Navigation>
      <MainNavigator />
    </Navigation>
  );
};

export default NavigationScreens;
