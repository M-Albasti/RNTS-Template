import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveButtonStyles} from './styles/resolveButtonStyles';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /** Removes elevation — use inside elevated cards or list rows. */
  flat?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const ELEVATED_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'danger'];

const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  flat = false,
  disabled,
  style,
  labelStyle,
  ...pressableProps
}: ButtonProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveButtonStyles);

  const sizeStyle =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

  const usesShadow =
    !flat && ELEVATED_VARIANTS.includes(variant);

  const getContainerStyles = (pressed: boolean): ViewStyle[] => {
    switch (variant) {
      case 'secondary':
        return pressed
          ? [styles.secondary, styles.secondaryPressed]
          : [styles.secondary];
      case 'outline':
        return pressed ? [styles.outline, styles.outlinePressed] : [styles.outline];
      case 'ghost':
        return pressed ? [styles.ghost, styles.ghostPressed] : [styles.ghost];
      case 'danger':
        return pressed ? [styles.danger, styles.dangerPressed] : [styles.danger];
      case 'primary':
      default:
        return pressed ? [styles.primary, styles.primaryPressed] : [styles.primary];
    }
  };

  const labelStyleByVariant =
    variant === 'secondary'
      ? styles.labelSecondary
      : variant === 'danger'
        ? styles.labelDanger
        : variant === 'outline' || variant === 'ghost'
          ? styles.labelAccent
          : styles.labelPrimary;

  const indicatorColor =
    variant === 'outline' || variant === 'ghost'
      ? (styles.labelAccent as TextStyle).color
      : (styles.labelPrimary as TextStyle).color;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      {...pressableProps}
      style={({pressed}) => [
        styles.base,
        usesShadow ? styles.shadowSm : styles.shadowNone,
        sizeStyle,
        ...getContainerStyles(pressed),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text style={[labelStyleByVariant, labelStyle]}>{label}</Text>
      )}
    </Pressable>
  );
};

export default Button;
