import React from 'react';
import {View} from 'react-native';

import TouchableTextIcon from '@atoms/TouchableTextIcon';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const TouchableTextIconSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <TouchableTextIcon
        iconType="Ionicons"
        name="share-outline"
        text="Share"
        size={24}
        onPress={() => {}}
      />
      <TouchableTextIcon
        iconType="Ionicons"
        name="share-outline"
        text="Disabled"
        size={24}
        onPress={() => {}}
        disabled
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Touchable Text Icon',
  sections: [{title: 'States', content: <TouchableTextIconSection />}],
});
