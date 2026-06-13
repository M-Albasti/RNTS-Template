import {useColorScheme} from 'react-native';

import {useAppSelector} from '@hooks/useAppSelector';
import type {ColorScheme} from '@theme/tokens';

/** Resolves light/dark tokens from the user's theme preference and device setting. */
export const useAppColorScheme = (): ColorScheme => {
  const themeMode =
    useAppSelector(state => state.appSettings.themeMode) ?? 'system';
  const systemScheme = useColorScheme();

  if (themeMode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return themeMode;
};
