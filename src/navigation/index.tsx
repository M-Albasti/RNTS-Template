//* packages import
import React from 'react';

//* navigators import
import Navigation from '@navigation/NavigationContainer';
import MainNavigator from '@navigation/MainNavigator';

const NavigationScreens = (): React.JSX.Element => {
  return (
    <Navigation>
      <MainNavigator />
    </Navigation>
  );
};

export default NavigationScreens;
