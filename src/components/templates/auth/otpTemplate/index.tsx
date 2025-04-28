//* packages import
import React from 'react';
import {View, StyleSheet} from 'react-native';

//* components import
import OTPHeader from '@organisms/auth/otp/OTPHeader';
import OTPForm from '@organisms/auth/otp/OTPForm';
import OTPFooter from '@organisms/auth/otp/OTPFooter';

//* types import
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AppStackNavigationProp} from '@Types/appNavigation';
import {OTPVerificationScreens} from '@Types/otpVerificationScreen';

//* constants import
import {appColors} from '@constants/colors';

interface OTPTemplateProps {
  navigation: AppStackNavigationProp<OTPVerificationScreens>;
  confirmation: FirebaseAuthTypes.ConfirmationResult;
}

const OTPTemplate = (props: OTPTemplateProps) => {
  return (
    <View style={styles.container}>
      <OTPHeader />
      <OTPForm
        navigation={props.navigation}
        confirmation={props.confirmation}
      />
      <OTPFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: appColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OTPTemplate;
