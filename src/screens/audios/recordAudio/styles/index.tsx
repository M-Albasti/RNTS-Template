import {appColors} from '@constants/colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recordAudioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTextStyle: {
    color: appColors.black,
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonContainerStyle: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
});
