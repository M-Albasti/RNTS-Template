//* packages import
import React from 'react';

//* components import
import RegisterTemplate from '@templates/auth/registerTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RegisterProps {
  navigation: AppStackNavigationProp<'Register'>;
}

const Register = ({navigation}: RegisterProps): React.JSX.Element => {
  return (
    <RegisterTemplate
      navigation={navigation}
      registerType={{key: 'Register', name: 'Register'}}
      keyboardType="email-address"
    />
  );
};

export default Register;
