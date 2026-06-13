import React from 'react';
import {View} from 'react-native';

import ScreenHeader from '@atoms/ScreenHeader';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const HeaderSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <ScreenHeader title="With back button" onBack={() => {}} />
      <ScreenHeader title="Without back" showBack={false} />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Screen Header',
  sections: [{title: 'Variants', content: <HeaderSection />}],
});
