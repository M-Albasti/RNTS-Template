//* packages import
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Slider from '@react-native-community/slider';

//* components import
import TextView from '@atoms/TextView';

//* theme import
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';

//* utils import
import {minutesFormat} from '@utils/minutesFormat';

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeekSound: (value: number) => void;
}

const AudioProgressBar = memo(
  ({currentTime, duration, onSeekSound}: AudioProgressBarProps) => {
    const styles = useThemedStyles(tokens =>
      StyleSheet.create({
        root: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: tokens.spacing.lg,
          gap: tokens.spacing.sm,
        },
        slider: {
          flex: 1,
          height: 40,
        },
        time: {
          minWidth: 44,
          textAlign: 'center',
        },
      }),
    );
    const {colors} = useThemeTokens();

    return (
      <View style={styles.root}>
        <TextView
          text={minutesFormat(currentTime)}
          variant="caption"
          muted
          style={styles.time}
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          step={1}
          maximumValue={Math.max(duration, 1)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.borderStrong}
          tapToSeek
          onSlidingComplete={onSeekSound}
          thumbTintColor={colors.primary}
          value={currentTime}
        />
        <TextView
          text={minutesFormat(duration)}
          variant="caption"
          muted
          style={styles.time}
        />
      </View>
    );
  },
);

export default AudioProgressBar;
