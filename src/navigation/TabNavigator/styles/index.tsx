import {navigationFallbackStyles as sharedNavigationFallbackStyles} from '../../shared/fallbackStyles';
import {useThemedStyles} from '@theme/createThemedStyles';

import {resolveTabNavigatorStyles} from './resolveTabNavigatorStyles';

export const useTabNavigatorStyles = () => useThemedStyles(resolveTabNavigatorStyles);

/** Static fallback styles for navigation loading state. */
export {sharedNavigationFallbackStyles as navigationFallbackStyles};

/** @deprecated Use `useTabNavigatorStyles()` */
export const styles = sharedNavigationFallbackStyles;

export {resolveTabNavigatorStyles};
