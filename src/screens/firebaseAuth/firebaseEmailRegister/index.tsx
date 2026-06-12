//* packages import
import React from 'react';

//* components import
import RegisterTemplate from '@templates/auth/registerTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseEmailRegisterProps {
  navigation: AppStackNavigationProp<'FirebaseEmailRegister'>;
}

const FirebaseEmailRegister = ({
  navigation,
}: FirebaseEmailRegisterProps): React.JSX.Element => {
  return (
    <RegisterTemplate
      navigation={navigation}
      registerType={{
        key: 'FirebaseEmailRegister',
        name: 'FirebaseEmailRegister',
      }}
      keyboardType="email-address"
    />
  );
};

export default FirebaseEmailRegister;
