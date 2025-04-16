//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import FirebaseLoginMethodButtons from '@organisms/firebaseLoginMethod/FirebaseLoginMethodsButtons';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseLoginMethodTemplateProps {
  // Define any props you need here
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodTemplate = (
  props: FirebaseLoginMethodTemplateProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <FirebaseLoginMethodButtons navigation={props.navigation} />
    </View>
  );
};

export default FirebaseLoginMethodTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
