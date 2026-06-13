import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {StyleSheet} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {layout} from '@theme/tokens';

const TAB_HEIGHT = ScreenHeight * 0.07;

export const useTabNavigatorStyles = () =>
  useThemedStyles(tokens => ({
      tabBarStyle: {
        borderRadius: TAB_HEIGHT,
        width: ScreenWidth * 0.8,
        marginBottom: 10,
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
        width: TAB_HEIGHT - 5,
        height: TAB_HEIGHT - 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: TAB_HEIGHT / 2.7,
        borderRadius: TAB_HEIGHT - 5,
      },
      floatingButtonStyle: {
        borderWidth: 10,
        height: ScreenHeight * 0.08,
        borderRadius: ScreenWidth,
        width: ScreenHeight * 0.08,
        marginBottom: TAB_HEIGHT,
        backgroundColor: tokens.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        ...tokens.shadows.lg,
      },
      fallback: {
        flex: tokens.layout.flex.fill,
        justifyContent: 'center',
        alignItems: 'center',
      },
      fallbackText: {
        fontSize: 25,
      },
    }));

/** Static fallback styles for navigation loading state. */
export const navigationFallbackStyles = StyleSheet.create({
  fallback: {
    flex: layout.flex.fill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 25,
  },
});

/** @deprecated Use `useTabNavigatorStyles()` */
export const styles = navigationFallbackStyles;
