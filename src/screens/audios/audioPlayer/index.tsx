import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import TouchableIcon from '@atoms/TouchableIcon';
import {appColors} from '@constants/colors';
import Slider from '@react-native-community/slider';
import {sounds} from '@constants/sounds';
import {styles} from './styles';
import {useFocusEffect} from '@react-navigation/native';

const Audio = (props: any): React.JSX.Element => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded) {
        loadSound();
      }
    }, []),
  );

  useEffect(() => {
    if (isLoaded) {
      const _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
        'FinishedPlaying',
        ({success}) => {
          stopSound().then(() => {
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
  const loadSound = () => {
    try {
      setIsLoaded(true);
      setIsPlaying(false);
      SoundPlayer.loadUrl(
        'https://www.chosic.com/wp-content/uploads/2021/04/kvgarlic__largestreamoverloginforestmarch.mp3',
      );
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.mainbar}>
          <TouchableIcon
            iconType={'AntDesign'}
            name={'left'}
            size={24}
            color={appColors.black}
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
            source={{uri: sounds[0].artwork}}
            style={styles.imageView}
            resizeMode="stretch"
          />
        </View>

        <View style={styles.nameOfSongView}>
          <Text style={styles.nameOfSongText1}>#02 - Practice</Text>
          <Text style={styles.nameOfSongText2}>
            Digital Marketing - By Setup Cast
          </Text>
        </View>

        <View style={styles.sliderView}>
          <Text style={styles.sliderTime}> 4:10 </Text>
          <Slider
            style={styles.sliderStyle}
            minimumValue={0}
            maximumValue={12.02}
            minimumTrackTintColor={appColors.primary}
            maximumTrackTintColor={appColors.black60}
            thumbTintColor={appColors.primary}
            value={3.5}
          />
          <Text style={styles.sliderTime}>12:02</Text>
        </View>

        <View style={styles.functionsView}>
          <TouchableIcon
            iconType={'FontAwesome'}
            name={'stop-circle'}
            size={35}
            color={appColors.primary}
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
        <Text style={styles.status}>
          {isLoaded ? 'Loading...' : isPlaying ? 'Playing...' : 'Stopped'}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Audio;
