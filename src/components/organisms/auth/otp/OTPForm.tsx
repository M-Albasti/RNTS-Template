//* packages import
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenWidth} from '@rneui/base';

//* components import
import OTPTextInput from '@molecules/otpTextInput';
import OTPSendButton from '@molecules/otpSendButton';

//* services import
import {confirmPhoneVerificationCode} from '@services/authServices/verifyPhoneService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {OTPVerificationScreens} from '@Types/otpVerificationScreen';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {LoginTypes} from '@Types/loginTypes';

interface OTPFormProps {
  navigation: AppStackNavigationProp<OTPVerificationScreens>;
  confirmation: FirebaseAuthTypes.ConfirmationResult;
  loginType: LoginTypes;
}

const OTPForm = (props: OTPFormProps): React.JSX.Element => {
  const [code, setCode] = useState<string>('');
  const dispatch = useAppDispatch();

  const onFocus = () => {
    console.log('onFocus Event !!');
  };

  const onBlur = () => {
    console.log('onBlur Event !!');
  };

  const onTextChange = (text: string) => {
    setCode(text);
    console.log('onTextChange Event !!', text);
  };

  const onFilled = (text: string) => {
    setCode(text);
    console.log('onFilled Event !!', text);
  };

  const sendOTP = () => {
    confirmPhoneVerificationCode(
      props.confirmation,
      code,
      dispatch,
      props.loginType,
    );
  };

  return (
    <View style={styles.container}>
      <OTPTextInput
        onFocus={onFocus}
        onBlur={onBlur}
        onTextChange={onTextChange}
        onFilled={onFilled}
      />
      <OTPSendButton sendOTP={sendOTP} code={code} />
    </View>
  );
};

export default OTPForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ScreenWidth,
  },
});
