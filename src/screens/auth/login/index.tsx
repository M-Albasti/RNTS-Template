//* packages import
import React from 'react';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginProps {
  navigation: AppStackNavigationProp<'Login'>;
}

/** Screen shell only — layout and styling live in LoginTemplate + theme tokens. */
const Login = (props: LoginProps): React.JSX.Element => {
  return (
    <LoginTemplate
      navigation={props.navigation}
      register={true}
      registerType={{key: 'Register', name: 'Register'}}
      loginType={'Normal'}
    />
  );
};

export default Login;
