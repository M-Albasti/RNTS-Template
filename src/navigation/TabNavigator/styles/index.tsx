import {appColors} from '@constants/colors';
import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {StyleSheet, Platform} from 'react-native';

const TAB_HIGHT = ScreenHeight * 0.07;

export const styles = StyleSheet.create({
  tabBarStyle: {
    borderRadius: TAB_HIGHT,
    width: ScreenWidth * 0.8,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: appColors.black,
    height: TAB_HIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
      android: {
        elevation: 4, // Shadow on Android
      },
    }),
  },
  tabBarItemStyle: {
    height: TAB_HIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerStyle: {
    width: TAB_HIGHT - 5,
    height: TAB_HIGHT - 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:
      Platform.OS === 'android' ? TAB_HIGHT / 2.7 - 5 : TAB_HIGHT / 2.7 + 4,
    borderRadius: TAB_HIGHT - 5,
  },
  floatingButtonStyle: {
    borderWidth: 10,
    height: ScreenHeight * 0.08,
    borderRadius: ScreenWidth,
    width: ScreenHeight * 0.08,
    marginBottom: TAB_HIGHT,
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 25,
  },
  outerBox: {
    width: 150,
    height: 150,
    backgroundColor: '#b58df1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 20,
  },
  box: {
    width: 80,
    height: 80,
    backgroundColor: '#782aeb',
  },
});
