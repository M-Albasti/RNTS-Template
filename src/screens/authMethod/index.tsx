//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import AuthMethodTemplate from '@templates/authMethod';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface AuthMethodProps {
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethod = (props: AuthMethodProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <AuthMethodTemplate navigation={props.navigation} />
    </View>
  );
};

export default AuthMethod;
