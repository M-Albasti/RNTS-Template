import {ScreenHeight, ScreenWidth} from '@rneui/base';

import {navigationFallbackStyles as sharedNavigationFallbackStyles} from '../../shared/fallbackStyles';
import {useThemedStyles} from '@theme/createThemedStyles';

import {resolveTabNavigatorStyles} from './resolveTabNavigatorStyles';

const TAB_HEIGHT = ScreenHeight * 0.07;

export const useTabNavigatorStyles = () => useThemedStyles(resolveTabNavigatorStyles);

/** Static fallback styles for navigation loading state. */
export {sharedNavigationFallbackStyles as navigationFallbackStyles};

/** @deprecated Use `useTabNavigatorStyles()` */
export const styles = sharedNavigationFallbackStyles;

export {resolveTabNavigatorStyles};
