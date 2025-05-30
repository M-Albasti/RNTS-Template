//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface FirebaseEmailLoginProps {
  navigation: AppStackNavigationProp<'FirebaseEmailLogin'>;
}

const FirebaseEmailLogin = (
  props: FirebaseEmailLoginProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginTemplate
        navigation={props.navigation}
        loginType={'FirebaseEmail'}
        register={true}
        registerType={{
          key: 'FirebaseEmailRegister',
          name: 'FirebaseEmailRegister',
        }}
        keyboardType={'email-address'}
      />
    </View>
  );
};

export default FirebaseEmailLogin;
