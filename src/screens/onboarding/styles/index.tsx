import {layout} from '@theme/tokens';

import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: layout.flex.fill,
  },
  onBoardingContainer: {
    flex: layout.flex.fill,
  },
  imageOnBoardingContainer: {
    width: ScreenWidth,
    height: ScreenHeight / 2,
    resizeMode: 'cover',
  },
});
