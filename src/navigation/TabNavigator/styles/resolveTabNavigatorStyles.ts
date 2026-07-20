import {navigationFallbackStyles as sharedNavigationFallbackStyles} from '../../shared/fallbackStyles';
import type {ThemeTokens} from '@theme/types';

export const resolveTabNavigatorStyles = (_tokens: ThemeTokens) => ({
  fallback: sharedNavigationFallbackStyles.fallback,
  fallbackText: sharedNavigationFallbackStyles.fallbackText,
});
