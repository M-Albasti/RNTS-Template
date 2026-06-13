import React from 'react';

import OTPInput from '@atoms/OTPInput';
import {useThemedStyles} from '@theme/createThemedStyles';

interface OTPTextInputProps {
  onFocus: () => void;
  onBlur: () => void;
  onTextChange: (text: string) => void;
  onFilled: (text: string) => void;
}

const OTPTextInput = (props: OTPTextInputProps): React.JSX.Element => {
  const styles = useThemedStyles(t => ({
    pinContainer: {
      width: '100%' as const,
      alignItems: t.layout.alignItems.center,
      marginVertical: t.spacing.xl,
    },
    pinCodeContainer: {
      width: t.sizes.otpCell,
      height: t.sizes.otpCell,
      borderRadius: t.radius.sm,
      borderWidth: t.layout.borderWidth.sm,
      borderColor: t.colors.borderStrong,
      alignItems: t.layout.alignItems.center,
      justifyContent: t.layout.justifyContent.center,
      marginHorizontal: t.spacing.xs,
    },
    pinCodeText: {
      ...t.typography.input,
      color: t.colors.textPrimary,
    },
    focusStick: {
      width: t.sizes.otpCaretWidth,
      height: t.sizes.otpCaretHeight,
      backgroundColor: t.colors.textPrimary,
    },
    activePinCodeContainer: {
      borderColor: t.colors.primary,
      borderWidth: t.layout.borderWidth.md,
    },
    placeholderText: {
      ...t.typography.input,
      color: t.colors.textMuted,
    },
    filledPinCodeContainer: {
      backgroundColor: t.colors.surfaceSecondary,
      borderColor: t.colors.borderStrong,
    },
    disabledPinCodeContainer: {
      backgroundColor: t.colors.surfaceSecondary,
      borderColor: t.colors.borderStrong,
      opacity: 0.5,
    },
  }));

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
