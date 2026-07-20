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
      <ScreenHeader
        title="Drawer hub"
        showBack={false}
        showDrawer
        onDrawerPress={() => {}}
        rightActions={[
          {key: 'search', iconName: 'search-outline', onPress: () => {}},
          {key: 'bell', iconName: 'notifications-outline', onPress: () => {}},
        ]}
      />
      <ScreenHeader
        title="Back + actions"
        subtitle="Optional subtitle"
        onBack={() => {}}
        rightActions={[
          {key: 'share', iconName: 'share-outline', onPress: () => {}},
          {key: 'more', iconName: 'ellipsis-horizontal', onPress: () => {}},
        ]}
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Screen Header',
  sections: [{title: 'Variants', content: <HeaderSection />}],
});
