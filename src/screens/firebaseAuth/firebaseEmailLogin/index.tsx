//* packages import
import React from 'react';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseEmailLoginProps {
  navigation: AppStackNavigationProp<'FirebaseEmailLogin'>;
}

const FirebaseEmailLogin = ({
  navigation,
}: FirebaseEmailLoginProps): React.JSX.Element => {
  return (
    <LoginTemplate
      navigation={navigation}
      loginType="FirebaseEmail"
      register
      registerType={{
        key: 'FirebaseEmailRegister',
        name: 'FirebaseEmailRegister',
      }}
      keyboardType="email-address"
    />
  );
};

export default FirebaseEmailLogin;
