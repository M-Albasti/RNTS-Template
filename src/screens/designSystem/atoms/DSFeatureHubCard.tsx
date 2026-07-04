import React from 'react';
import {View} from 'react-native';

import FeatureHubCard from '@atoms/FeatureHubCard';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const CardsSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.row}>
      <FeatureHubCard
        title="Default"
        subtitle="Primary muted accent"
        iconType="Ionicons"
        iconName="star-outline"
        onPress={() => {}}
      />
      <FeatureHubCard
        title="Custom accent"
        subtitle="#FEE2E2 background"
        iconType="Ionicons"
        iconName="heart-outline"
        accentColor="#FEE2E2"
        onPress={() => {}}
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Feature Hub Card',
  sections: [{title: 'Default and custom accent', content: <CardsSection />}],
});
