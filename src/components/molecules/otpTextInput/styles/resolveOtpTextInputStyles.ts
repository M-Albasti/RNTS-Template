import type {ThemeTokens} from '@theme/types';

/** Focusify-style OTP cells: soft fill, large radius, primary focus ring. */
export const resolveOtpTextInputStyles = (tokens: ThemeTokens) => ({
  pinContainer: {
    width: '100%' as const,
    alignItems: tokens.layout.alignItems.center,
    marginVertical: tokens.spacing.xl,
  },
  pinCodeContainer: {
    width: tokens.sizes.otpCell + 4,
    height: tokens.sizes.otpCell + 8,
    borderRadius: tokens.radius.lg,
    borderWidth: 1.5,
    borderColor: tokens.colors.transparent,
    backgroundColor: `${tokens.colors.textPrimary}0F`,
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
    backgroundColor: tokens.colors.primary,
  },
  activePinCodeContainer: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.surface,
  },
  placeholderText: {
    ...tokens.typography.input,
    color: tokens.colors.textMuted,
  },
  filledPinCodeContainer: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
  },
  disabledPinCodeContainer: {
    backgroundColor: `${tokens.colors.textPrimary}0A`,
    opacity: 0.5,
  },
});
