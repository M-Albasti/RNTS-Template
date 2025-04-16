//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import AuthMethodButtons from '@organisms/authMethod/AuthMethodsButtons';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodTemplateProps {
  // Define any props you need here
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethodTemplate = (
  props: AuthMethodTemplateProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <AuthMethodButtons navigation={props.navigation} />
    </View>
  );
};

export default AuthMethodTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
