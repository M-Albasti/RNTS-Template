import React from 'react';
import Navigation from './NavigationContainer';
import StackNavigation from './StackNavigation';

const NavigationScreens = (): React.JSX.Element => {
  return (
    <Navigation>
      <StackNavigation />
    </Navigation>
  );
};

export default NavigationScreens;
