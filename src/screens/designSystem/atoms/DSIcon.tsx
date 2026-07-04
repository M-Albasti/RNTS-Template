import React from 'react';
import {View} from 'react-native';

import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const IconSamples = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <TextView text="Ionicons" variant="caption" muted />
      <View style={styles.row}>
        <IconView iconType="Ionicons" name="home" size={28} />
        <IconView iconType="Ionicons" name="settings" size={28} />
        <IconView iconType="Ionicons" name="heart" size={28} />
      </View>
      <TextView text="MaterialCommunityIcons" variant="caption" muted />
      <View style={styles.row}>
        <IconView iconType="MaterialCommunityIcons" name="firebase" size={28} />
        <IconView iconType="MaterialCommunityIcons" name="account" size={28} />
        <IconView iconType="MaterialCommunityIcons" name="bell" size={28} />
      </View>
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Icon',
  subtitle: 'Vector icons via react-native-vector-icons.',
  sections: [{title: 'Samples', content: <IconSamples />}],
});
