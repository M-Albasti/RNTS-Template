import {useMemo} from 'react';

import {useAppColorScheme} from '@hooks/useAppColorScheme';
import {useAppSelector} from '@hooks/useAppSelector';
import {createThemeTokens, type ThemeTokens} from '@theme/tokens';

/**
 * Returns the active design tokens for the current light/dark scheme and language.
 * Use in components instead of importing raw colors or hard-coded StyleSheet values.
 */
export const useThemeTokens = (): ThemeTokens => {
  const scheme = useAppColorScheme();
  const lang = useAppSelector(state => state.appSettings.lang);

  return useMemo(() => createThemeTokens(scheme, lang), [scheme, lang]);
};
