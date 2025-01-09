import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  onBoardingContainer: {
    flex: 1,
  },
  imageOnBoardingContainer: {
    width: ScreenWidth,
    height: ScreenHeight / 2,
    resizeMode: 'cover',
  },
});
