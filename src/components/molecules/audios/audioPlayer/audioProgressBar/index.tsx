//* packages import
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {ScreenHeight} from '@rneui/base';

//* components import
import TextView from '@atoms/TextView';

//* constants import
import {appColors} from '@constants/colors';

//* utils import
import {minutesFormat} from '@utils/minutesFormat';

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeekSound: (value: number) => void;
}

const AudioProgressBar = memo((props: AudioProgressBarProps) => {
  return (
    <View style={styles.sliderView}>
      <TextView
        text={minutesFormat(props.currentTime)}
        containerStyle={styles.containerSliderTime}
        style={styles.sliderTime}
      />
      <Slider
        style={styles.sliderStyle}
        minimumValue={0}
        step={1}
        maximumValue={props.duration}
        minimumTrackTintColor={appColors.primary}
        maximumTrackTintColor={appColors.black60}
        tapToSeek={true}
        onSlidingComplete={props.onSeekSound}
        thumbTintColor={appColors.primary}
        value={props.currentTime}
      />
      <TextView
        text={minutesFormat(props.duration)}
        containerStyle={styles.containerSliderTime}
        style={styles.sliderTime}
      />
    </View>
  );
});

export default AudioProgressBar;

const styles = StyleSheet.create({
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
});
