//* packages import
import {Appearance} from 'react-native';

//* types import
import type {Theme} from '@react-navigation/native';

import {getSemanticColors, type ColorScheme} from '@theme/tokens';

/**
 * Maps semantic tokens to React Navigation theme colors.
 * NavigationContainer uses this so headers/tabs match app surfaces automatically.
 */
export const createNavigationTheme = (
  baseTheme: Theme,
  scheme: ColorScheme,
): Theme => {
  const colors = getSemanticColors(scheme);

  return {
    ...baseTheme,
    dark: scheme === 'dark',
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.error,
    },
  };
};

// Legacy alias — same as createNavigationTheme.
export {createNavigationTheme as createMyTheme};

// Legacy static check — prefer `useThemeTokens()` in new components.
export const isDarkTheme = Appearance.getColorScheme() === 'dark';
