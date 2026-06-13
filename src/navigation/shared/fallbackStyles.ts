import {StyleSheet} from 'react-native';

import {layout, typography} from '@theme/tokens';

/** Shared loading/fallback styles for stack navigators. */
export const navigationFallbackStyles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
  },
  fallback: {
    flex: layout.flex.fill,
    justifyContent: layout.justifyContent.center,
    alignItems: layout.alignItems.center,
  },
  fallbackText: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
  },
});
