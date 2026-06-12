import {useMemo} from 'react';
import {useColorScheme} from 'react-native';

import {createThemeTokens, type ThemeTokens} from '@theme/tokens';

/**
 * Returns the active design tokens for the current light/dark scheme.
 * Use in components instead of importing raw colors or hard-coded StyleSheet values.
 */
export const useThemeTokens = (): ThemeTokens => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return useMemo(() => createThemeTokens(scheme), [scheme]);
};
