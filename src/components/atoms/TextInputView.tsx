import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveTextInputViewStyles} from './styles/resolveTextInputViewStyles';

type TextInputViewProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  /** @deprecated RNEUI compat — ignored; styling comes from theme. */
  inputContainerStyle?: ViewStyle;
  /** @deprecated RNEUI compat */
  inputStyle?: ViewStyle;
  /** @deprecated RNEUI compat */
  labelStyle?: ViewStyle;
};

/**
 * Modern filled auth/form field (Focusify-style).
 * Soft rounded surface, leading/trailing icons, no underline chrome.
 */
const TextInputView = ({
  label,
  leftIcon,
  rightIcon,
  errorMessage,
  disabled,
  containerStyle,
  onFocus,
  onBlur,
  placeholderTextColor,
  editable,
  multiline,
  ...inputProps
}: TextInputViewProps): React.JSX.Element => {
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveTextInputViewStyles);
  const [focused, setFocused] = useState(false);
  const isEditable = editable ?? !disabled;

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && isEditable && styles.fieldFocused,
          !!errorMessage && styles.fieldError,
          !isEditable && {opacity: 0.6},
        ]}>
        {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        <TextInput
          {...inputProps}
          multiline={multiline}
          editable={isEditable}
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={placeholderTextColor ?? colors.textMuted}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
        {rightIcon ? <View style={styles.iconSlot}>{rightIcon}</View> : null}
      </View>
      {errorMessage ? (
        <Text style={[styles.label, {color: colors.error}]}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default TextInputView;
