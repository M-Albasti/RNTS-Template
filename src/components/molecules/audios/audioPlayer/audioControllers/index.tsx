//* packages import
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenHeight} from '@rneui/base';

//* components import
import TouchableIcon from '@atoms/TouchableIcon';

//* constants import
import {appColors} from '@constants/colors';

interface AudioControllersProps {
  isPlaying: boolean;
  repeat: boolean;
  playSound: () => void;
  pauseSound: () => void;
  stopSound: () => void;
  repeatSound: () => void;
}

const AudioControllers = memo((props: AudioControllersProps) => {
  return (
    <View style={styles.functionsView}>
      <TouchableIcon
        iconType={'FontAwesome'}
        name={'stop-circle'}
        size={35}
        color={appColors.primary}
        onPress={props.stopSound}
      />
      <TouchableIcon
        iconType={'Entypo'}
        name="controller-fast-backward"
        size={24}
        color={appColors.primary}
      />
      <TouchableIcon
        iconType={'AntDesign'}
        name={props.isPlaying ? 'pausecircle' : 'play'}
        size={50}
        color={appColors.primary}
        onPress={props.isPlaying ? props.pauseSound : props.playSound}
      />
      <TouchableIcon
        iconType={'Entypo'}
        name="controller-fast-forward"
        size={24}
        color={appColors.primary}
      />
      <TouchableIcon
        iconType={'MaterialCommunityIcons'}
        name={props.repeat ? 'repeat-off' : 'repeat'}
        size={25}
        color={appColors.primary}
        onPress={props.repeatSound}
      />
    </View>
  );
});

export default AudioControllers;

const styles = StyleSheet.create({
  functionsView: {
    flexDirection: 'row',
    height: ScreenHeight * 0.1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});
