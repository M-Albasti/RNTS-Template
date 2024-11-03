import React, {useCallback, useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, View} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import TouchableIcon from '@atoms/TouchableIcon';
import {appColors} from '@constants/colors';
import Slider from '@react-native-community/slider';
import {sounds} from '@constants/sounds';
import {styles} from './styles';
import {useFocusEffect} from '@react-navigation/native';
import {minutesFormat} from '@utils/minutesFormat';
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface AudioPlayerProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
  route: AppRouteProp<'AudioPlayer'>;
}

const AudioPlayer = (props: AudioPlayerProps): React.JSX.Element => {
  const {audioDetails} = props.route.params;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded) {
        loadSound();
      }
    }, [isLoaded]),
  );

  useEffect(() => {
    let interval: number | NodeJS.Timeout | null = null;
    if (isPlaying) {
      if (currentTime < duration) {
        interval = setInterval(async () => {
          setCurrentTime((await SoundPlayer.getInfo()).currentTime);
        }, 1000);
      }
    }
    return () => {
      if (interval != null) {
        clearInterval(interval); // Cleanup on unmount
      }
    };
  }, [currentTime, duration, isPlaying]);

  useEffect(() => {
    if (isLoaded) {
      const _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
        'FinishedPlaying',
        ({success}) => {
          stopSound().then(() => {
            if (Platform.OS === 'android') {
              loadSound();
            }
            if (repeat) {
              playSound();
            }
          });
          console.log('finished playing', success, repeat);
        },
      );
      const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
        'FinishedLoadingURL',
        ({success, url}) => {
          console.log('finished loading url', success, url);
        },
      );
      return () => {
        _onFinishedPlayingSubscription.remove();
        _onFinishedLoadingURLSubscription.remove();
      };
    }
  }, [repeat, isLoaded]);

  {
    /* Sound Player */
  }
  const loadSound = async () => {
    try {
      setIsLoaded(true);
      setIsPlaying(false);
      SoundPlayer.loadUrl(audioDetails?.url);
      setCurrentTime((await SoundPlayer.getInfo()).currentTime);
      setDuration((await SoundPlayer.getInfo()).duration);
    } catch (error) {
      setIsLoaded(false);
      console.log('loadSound Error =>', error);
    }
  };

  const playSound = () => {
    try {
      // SoundPlayer.setNumberOfLoops(-1);
      SoundPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.log('playSound Error =>', error);
    }
  };

  const pauseSound = () => {
    try {
      if (isPlaying) {
        SoundPlayer.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log('pauseSound Error =>', error);
    }
  };

  const stopSound = async () => {
    try {
      SoundPlayer.stop();
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (error) {
      console.log('stopSound Error =>', error);
    }
  };

  const repeatSound = () => {
    try {
      setRepeat(!repeat);
    } catch (error) {
      console.log('resumeSound Error =>', error);
    }
  };

  const onSeekSound = (value: number) => {
    SoundPlayer.seek(value);
    setCurrentTime(value);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
          <Text style={styles.nowPlayingText}> Now Playing </Text>
          <TouchableIcon
            iconType={'Entypo'}
            name="dots-three-horizontal"
            size={24}
            color={appColors.black}
          />
        </View>

        <View style={styles.musicLogoView}>
          <Image
            source={{uri: audioDetails.artwork}}
            style={styles.imageView}
            resizeMode="stretch"
          />
        </View>

        <View style={styles.nameOfSongView}>
          <Text style={styles.nameOfSongText1}>{audioDetails.artist}</Text>
          <Text style={styles.nameOfSongText2}>{audioDetails.album}</Text>
        </View>

        <View style={styles.sliderView}>
          <Text style={styles.sliderTime}> {minutesFormat(currentTime)} </Text>
          <Slider
            style={styles.sliderStyle}
            minimumValue={0}
            step={1}
            maximumValue={duration}
            minimumTrackTintColor={appColors.primary}
            maximumTrackTintColor={appColors.black60}
            tapToSeek={true}
            onSlidingComplete={onSeekSound}
            thumbTintColor={appColors.primary}
            value={currentTime}
          />
          <Text style={styles.sliderTime}>{minutesFormat(duration)}</Text>
        </View>

        <View style={styles.functionsView}>
          <TouchableIcon
            iconType={'FontAwesome'}
            name={'stop-circle'}
            size={35}
            color={appColors.primary}
            onPress={stopSound}
          />
          <TouchableIcon
            iconType={'Entypo'}
            name="controller-fast-backward"
            size={24}
            color={appColors.primary}
          />
          <TouchableIcon
            iconType={'AntDesign'}
            name={isPlaying ? 'pausecircle' : 'play'}
            size={50}
            color={appColors.primary}
            onPress={isPlaying ? pauseSound : playSound}
          />
          <TouchableIcon
            iconType={'Entypo'}
            name="controller-fast-forward"
            size={24}
            color={appColors.primary}
          />
          <TouchableIcon
            iconType={'MaterialCommunityIcons'}
            name={repeat ? 'repeat-off' : 'repeat'}
            size={25}
            color={appColors.primary}
            onPress={repeatSound}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AudioPlayer;
