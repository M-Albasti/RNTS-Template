//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface LoginProps {
  navigation: AppStackNavigationProp<'FirebasePhoneLogin'>;
}

const FirebasePhoneLogin = (props: LoginProps): React.JSX.Element => {
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
