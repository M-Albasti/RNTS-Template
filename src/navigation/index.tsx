//* packages import
import React from 'react';

//* navigators import
import Navigation from './NavigationContainer';
import StackNavigator from './StackNavigator';

const NavigationScreens = (): React.JSX.Element => {
  return (
    <Navigation>
      <StackNavigator />
    </Navigation>
  );
};

export default NavigationScreens;
