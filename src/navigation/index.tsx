import React from 'react';
import Navigation from './NavigationContainer';
import TabNavigation from './TabNavigation';

const NavigationScreens = (): React.JSX.Element => {
  return (
    <Navigation>
      <TabNavigation />
    </Navigation>
  );
};

export default NavigationScreens;
