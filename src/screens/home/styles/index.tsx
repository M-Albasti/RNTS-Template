import {layout, typography} from '@theme/tokens';
import {lightColors} from '@theme/tokens/colors.light';

import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
    justifyContent: layout.justifyContent.center,
    alignItems: layout.alignItems.center,
  },
  wrapper: {},
  slide1: {
    flex: layout.flex.fill,
    justifyContent: layout.justifyContent.center,
    alignItems: layout.alignItems.center,
    backgroundColor: lightColors.accent1,
  },
  slide2: {
    flex: layout.flex.fill,
    justifyContent: layout.justifyContent.center,
    alignItems: layout.alignItems.center,
    backgroundColor: lightColors.accent2,
  },
  slide3: {
    flex: layout.flex.fill,
    justifyContent: layout.justifyContent.center,
    alignItems: layout.alignItems.center,
    backgroundColor: lightColors.accent3,
  },
  text: {
    color: lightColors.textInverse,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    fontWeight: typography.display.fontWeight,
  },
});
