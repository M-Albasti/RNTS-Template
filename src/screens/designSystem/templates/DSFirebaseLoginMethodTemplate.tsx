import React from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import FirebaseLoginMethodsButtons from '@organisms/firebaseLoginMethod/FirebaseLoginMethodsButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  firebaseLoginMethodShowcaseNavigation,
  useShowcaseStack,
} from '../shared/showcaseHelpers';

const FirebaseLoginContent = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <Heading text="Firebase sign in" level="h1" align="center" />
      <Spacer size="sm" />
      <FirebaseLoginMethodsButtons
        navigation={firebaseLoginMethodShowcaseNavigation}
      />
      <Button label="Go back" variant="ghost" fullWidth onPress={() => {}} />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Firebase Login Method Template',
  sections: [{title: 'Provider list', content: <FirebaseLoginContent />}],
});
