import {appColors} from '@constants/colors';
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  button: {
    backgroundColor: appColors.primary,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
  },
  mainbar: {
    height: height * 0.1,
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
    height: height * 0.3,
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
    height: height * 0.15,
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
    height: height * 0.1,
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
    width: '15%',
    textAlign: 'center',
  },
  functionsView: {
    flexDirection: 'row',
    height: height * 0.1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});
