//* packages import
import React, {memo} from 'react';
import {View} from 'react-native';

//* components import
import TouchableIcon from '@atoms/TouchableIcon';

//* theme import
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioControllersStyles} from './styles/resolveAudioControllersStyles';

interface AudioControllersProps {
  isPlaying: boolean;
  repeat: boolean;
  playSound: () => void;
  pauseSound: () => void;
  stopSound: () => void;
  repeatSound: () => void;
}

const AudioControllers = memo(
  ({
    isPlaying,
    repeat,
    playSound,
    pauseSound,
    stopSound,
    repeatSound,
  }: AudioControllersProps) => {
    const {colors, sizes} = useThemeTokens();
    const styles = useThemedStyles(resolveAudioControllersStyles);

    return (
      <View style={styles.root}>
        <TouchableIcon
          iconType="FontAwesome"
          name="stop-circle"
          size={sizes.iconMd}
          color={colors.primary}
          onPress={stopSound}
        />
        <TouchableIcon
          iconType="Entypo"
          name="controller-fast-backward"
          size={sizes.iconSm}
          color={colors.primary}
        />
        <View style={styles.playButton}>
          <TouchableIcon
            iconType="AntDesign"
            name={isPlaying ? 'pausecircle' : 'play'}
            size={sizes.iconMd}
            color={colors.primary}
            onPress={isPlaying ? pauseSound : playSound}
          />
        </View>
        <TouchableIcon
          iconType="Entypo"
          name="controller-fast-forward"
          size={sizes.iconSm}
          color={colors.primary}
        />
        <TouchableIcon
          iconType="MaterialCommunityIcons"
          name={repeat ? 'repeat' : 'repeat-off'}
          size={sizes.iconSm}
          color={colors.primary}
          onPress={repeatSound}
        />
      </View>
    );
  },
);

export default AudioControllers;
