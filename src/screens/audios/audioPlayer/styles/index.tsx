import {appColors} from '@constants/colors';
import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: ScreenWidth,
    height: ScreenHeight,
  },
  mainbar: {
    height: ScreenHeight * 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
  nowPlayingText: {
    fontSize: 19,
    textAlign: 'center',
  },
  musicLogoView: {
    height: ScreenHeight * 0.3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: '100%',
    width: '80%',
    borderRadius: 10,
  },
  nameOfSongView: {
    height: ScreenHeight * 0.15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameOfSongText1: {
    fontSize: 19,
    fontWeight: 'bold',
    color: appColors.black80,
  },
  nameOfSongText2: {
    color: appColors.black60,
    marginTop: '4%',
  },
  sliderView: {
    height: ScreenHeight * 0.1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
  sliderStyle: {
    height: '70%',
    width: '70%',
  },
  sliderTime: {
    fontSize: 15,
    color: appColors.gray,
    width: '100%',
    textAlign: 'center',
  },
  containerSliderTime: {
    width: '15%',
  },
  functionsView: {
    flexDirection: 'row',
    height: ScreenHeight * 0.1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});
