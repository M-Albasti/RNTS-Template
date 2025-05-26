//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface FirebasePhoneLoginProps {
  navigation: AppStackNavigationProp<'FirebasePhoneLogin'>;
}

const FirebasePhoneLogin = (
  props: FirebasePhoneLoginProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginTemplate
        navigation={props.navigation}
        loginType={'FirebasePhone'}
        otpVerification={true}
        register={false}
        otpVerificationType={'firebasePhoneOTP'}
        keyboardType={'phone-pad'}
      />
    </View>
  );
};

export default FirebasePhoneLogin;
