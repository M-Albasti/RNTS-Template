import {ScreenHeight, ScreenWidth} from '@rneui/base';

import {navigationFallbackStyles as sharedNavigationFallbackStyles} from '../../shared/fallbackStyles';
import type {ThemeTokens} from '@theme/types';

const TAB_HEIGHT = ScreenHeight * 0.07;

export const resolveTabNavigatorStyles = (tokens: ThemeTokens) => ({
  tabBarStyle: {
    borderRadius: TAB_HEIGHT,
    width: ScreenWidth * 0.8,
    marginBottom: tokens.spacing.sm,
    alignSelf: 'center',
    backgroundColor: tokens.colors.textPrimary,
    height: TAB_HEIGHT,
    ...tokens.shadows.lg,
  },
  tabBarItemStyle: {
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerStyle: {
    width: TAB_HEIGHT - tokens.spacing.xs,
    height: TAB_HEIGHT - tokens.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: TAB_HEIGHT / 2.7,
    borderRadius: TAB_HEIGHT - tokens.spacing.xs,
  },
  floatingButtonStyle: {
    borderWidth: tokens.sizes.tabBorder,
    height: ScreenHeight * 0.08,
    borderRadius: ScreenWidth,
    width: ScreenHeight * 0.08,
    marginBottom: TAB_HEIGHT,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: tokens.layout.overflow.hidden,
    ...tokens.shadows.lg,
  },
  fallback: sharedNavigationFallbackStyles.fallback,
  fallbackText: sharedNavigationFallbackStyles.fallbackText,
});
