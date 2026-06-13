//* packages import
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TouchableIcon from '@atoms/TouchableIcon';

//* theme import
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';

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
    const styles = useThemedStyles(tokens =>
      StyleSheet.create({
        root: {
          width: '100%',
          flexDirection: tokens.layout.flexDirection.row,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: tokens.spacing.xl,
          paddingTop: tokens.spacing.md,
        },
        playButton: {
          width: 64,
          height: 64,
          borderRadius: tokens.radius.full,
          backgroundColor: tokens.colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
          ...tokens.shadows.sm,
        },
      }),
    );
    const {colors} = useThemeTokens();

    return (
      <View style={styles.root}>
        <TouchableIcon
          iconType="FontAwesome"
          name="stop-circle"
          size={32}
          color={colors.primary}
          onPress={stopSound}
        />
        <TouchableIcon
          iconType="Entypo"
          name="controller-fast-backward"
          size={24}
          color={colors.primary}
        />
        <View style={styles.playButton}>
          <TouchableIcon
            iconType="AntDesign"
            name={isPlaying ? 'pausecircle' : 'play'}
            size={42}
            color={colors.primary}
            onPress={isPlaying ? pauseSound : playSound}
          />
        </View>
        <TouchableIcon
          iconType="Entypo"
          name="controller-fast-forward"
          size={24}
          color={colors.primary}
        />
        <TouchableIcon
          iconType="MaterialCommunityIcons"
          name={repeat ? 'repeat' : 'repeat-off'}
          size={26}
          color={colors.primary}
          onPress={repeatSound}
        />
      </View>
    );
  },
);

export default AudioControllers;
