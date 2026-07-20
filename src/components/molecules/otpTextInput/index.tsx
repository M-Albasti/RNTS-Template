import React from 'react';

import OTPInput from '@atoms/OTPInput';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveOtpTextInputStyles} from './styles/resolveOtpTextInputStyles';

interface OTPTextInputProps {
  onFocus: () => void;
  onBlur: () => void;
  onTextChange: (text: string) => void;
  onFilled: (text: string) => void;
}

const OTPTextInput = (props: OTPTextInputProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveOtpTextInputStyles);
  const {colors} = useThemeTokens();

  return (
    <OTPInput
      numberOfDigits={6}
      focusColor={colors.primary}
      autoFocus={false}
      hideStick={true}
      placeholder="·"
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
