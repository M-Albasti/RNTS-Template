//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';

//* components import
import OTPInput from '@atoms/OTPInput';

//* constants import
import {appColors} from '@constants/colors';

interface OTPTextInputProps {
  onFocus: () => void;
  onBlur: () => void;
  onTextChange: (text: string) => void;
  onFilled: (text: string) => void;
}

const OTPTextInput = (props: OTPTextInputProps) => {
  return (
    <OTPInput
      numberOfDigits={6}
      focusColor="green"
      autoFocus={false}
      hideStick={true}
      placeholder="******"
      blurOnFilled={true}
      disabled={false}
      type="numeric"
      secureTextEntry={false}
      focusStickBlinkingDuration={500}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onTextChange={props.onTextChange}
      onFilled={props.onFilled}
      textInputProps={{
        accessibilityLabel: 'One-Time Password',
      }}
      textProps={{
        accessibilityRole: 'text',
        accessibilityLabel: 'OTP digit',
        allowFontScaling: false,
      }}
      theme={{
        containerStyle: styles.pinContainer,
        pinCodeContainerStyle: styles.pinCodeContainer,
        pinCodeTextStyle: styles.pinCodeText,
        focusStickStyle: styles.focusStick,
        focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        placeholderTextStyle: styles.placeholderText,
        filledPinCodeContainerStyle: styles.filledPinCodeContainer,
        disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
      }}
    />
  );
};

export default OTPTextInput;

const styles = StyleSheet.create({
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  pinCodeContainer: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.silver,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  pinCodeText: {
    fontSize: 20,
    color: appColors.black,
  },
  focusStick: {
    width: 2,
    height: 20,
    backgroundColor: appColors.black,
  },
  activePinCodeContainer: {
    borderColor: appColors.primary,
    borderWidth: 2,
  },
  placeholderText: {
    fontSize: 20,
    color: appColors.gray,
  },
  filledPinCodeContainer: {
    backgroundColor: appColors.softWhite,
    borderColor: appColors.silver,
  },
  disabledPinCodeContainer: {
    backgroundColor: appColors.softWhite,
    borderColor: appColors.silver,
    opacity: 0.5,
  },
});
