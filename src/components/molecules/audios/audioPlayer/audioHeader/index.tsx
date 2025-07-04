//* packages import
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenHeight} from '@rneui/base';

//* components import
import TouchableIcon from '@atoms/TouchableIcon';
import TextView from '@atoms/TextView';

//* constants import
import {appColors} from '@constants/colors';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AudioHeaderProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
}

const AudioHeader = memo((props: AudioHeaderProps) => {
  return (
    <View style={styles.mainbar}>
      <TouchableIcon
        iconType={'AntDesign'}
        name={'left'}
        size={24}
        color={appColors.black}
        onPress={() => {
          if (props.navigation.canGoBack()) {
            props.navigation.goBack();
          }
        }}
      />
      <TextView text={'Now Playing'} style={styles.nowPlayingText} />
      <TouchableIcon
        iconType={'Entypo'}
        name="dots-three-horizontal"
        size={24}
        color={appColors.black}
      />
    </View>
  );
});

export default AudioHeader;

const styles = StyleSheet.create({
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
});
