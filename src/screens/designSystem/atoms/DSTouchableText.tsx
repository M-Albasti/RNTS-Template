import React from 'react';
import {View} from 'react-native';

import TouchableText from '@atoms/TouchableText';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const TouchableTextSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <TouchableText text="Default touchable text" onPress={() => {}} />
      <TouchableText text="Disabled" onPress={() => {}} disabled />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Touchable Text',
  sections: [{title: 'States', content: <TouchableTextSection />}],
});
