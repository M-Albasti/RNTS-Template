//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import FirebaseLoginMethodTemplate from '@templates/firebaseLoginMethod';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface FirebaseLoginMethodProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethod = (
  props: FirebaseLoginMethodProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <FirebaseLoginMethodTemplate navigation={props.navigation} />
    </View>
  );
};

export default FirebaseLoginMethod;
