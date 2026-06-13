import React from 'react';
import {View} from 'react-native';

import TouchableIcon from '@atoms/TouchableIcon';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const TouchableIconSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.row}>
      <TouchableIcon
        iconType="Ionicons"
        name="heart"
        size={32}
        onPress={() => {}}
      />
      <TouchableIcon
        iconType="Ionicons"
        name="heart"
        size={32}
        onPress={() => {}}
        disabled
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Touchable Icon',
  sections: [
    {title: 'Default and disabled', description: 'Right icon is disabled.', content: <TouchableIconSection />},
  ],
});
