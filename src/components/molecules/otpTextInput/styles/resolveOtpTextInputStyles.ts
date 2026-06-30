import type {ThemeTokens} from '@theme/types';

export const resolveOtpTextInputStyles = (tokens: ThemeTokens) => ({
    pinContainer: {
      width: '100%' as const,
      alignItems: tokens.layout.alignItems.center,
      marginVertical: tokens.spacing.xl,
    },
    pinCodeContainer: {
      width: tokens.sizes.otpCell,
      height: tokens.sizes.otpCell,
      borderRadius: tokens.radius.sm,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.borderStrong,
      alignItems: tokens.layout.alignItems.center,
      justifyContent: tokens.layout.justifyContent.center,
      marginHorizontal: tokens.spacing.xs,
    },
    pinCodeText: {
      ...tokens.typography.input,
      color: tokens.colors.textPrimary,
    },
    focusStick: {
      width: tokens.sizes.otpCaretWidth,
      height: tokens.sizes.otpCaretHeight,
      backgroundColor: tokens.colors.textPrimary,
    },
    activePinCodeContainer: {
      borderColor: tokens.colors.primary,
      borderWidth: tokens.layout.borderWidth.md,
    },
    placeholderText: {
      ...tokens.typography.input,
      color: tokens.colors.textMuted,
    },
    filledPinCodeContainer: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderColor: tokens.colors.borderStrong,
    },
    disabledPinCodeContainer: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderColor: tokens.colors.borderStrong,
      opacity: 0.5,
    },
  });
