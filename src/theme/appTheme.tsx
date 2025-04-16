//* packages import
import {Appearance} from 'react-native';

//* types import
import type {Theme} from '@react-navigation/native';

export const createMyTheme = (
  theme: Theme,
  primary: string = theme.colors.primary,
  background: string = theme.colors.background,
  card: string = theme.colors.card,
  text: string = theme.colors.text,
  border: string = theme.colors.border,
  notification: string = theme.colors.notification,
) => {
  return {
    ...theme,
    colors: {
      primary,
      background,
      card,
      text,
      border,
      notification,
    },
    fonts: theme.fonts,
  };
};

export const isDarkTheme = Appearance.getColorScheme() === 'dark';
