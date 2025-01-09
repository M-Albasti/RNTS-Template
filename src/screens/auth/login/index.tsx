import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {AppStackNavigationProp} from '@Types/appNavigation';
import LoginTemplate from '@templates/auth/loginTemplate';

interface LoginProps {
  navigation: AppStackNavigationProp<'Login'>;
}

const Login = (props: LoginProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginTemplate navigation={props.navigation} />
    </View>
  );
};

export default Login;
