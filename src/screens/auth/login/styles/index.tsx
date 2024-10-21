import {isDarkTheme} from '@services/appTheme';
import {appColors} from '@constants/colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: isDarkTheme ? appColors.white : appColors.black,
  },
});
