import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {permissionsRequest} from '@services/permissionsRequest';
import SoundPlayer from 'react-native-sound-player';
import TouchableIcon from '@molecules/TouchableIcon';
import {appColors} from '@constants/colors';
import Slider from '@react-native-community/slider';
import {sounds} from '@constants/sounds';

const {width, height} = Dimensions.get('screen');

const Audio = (props: any): React.JSX.Element => {
  const [recordSecs, setRecordSecs] = useState<string | number>();
  const [recordTime, setRecordTime] = useState<string>();
  const [currentPositionSec, setCurrentPositionSec] = useState<number>();
  const [currentDurationSec, setCurrentDurationSec] = useState<number>();
  const [playTime, setPlayTime] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recordPath, setRecordPath] = useState<string>();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  console.log(
    '🚀 ~ Audio ~ audioRecorderPlayer:',
    recordSecs,
    recordTime,
    currentPositionSec,
    currentDurationSec,
    playTime,
    duration,
  );

  useEffect(() => {
    permissionsRequest('microphone');
  }, []);

  {
    /* Sound Recorder */
  }
  const onStartRecord = async () => {
    try {
      const path = `audio-${new Date()}.m4a`;
      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVModeIOS: AVModeIOSOption.measurement,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      const meteringEnabled = false;

      const result = await audioRecorderPlayer.startRecorder(
        // path,
        undefined,
        audioSet,
        meteringEnabled,
      );

      audioRecorderPlayer.addRecordBackListener((e: any) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        );
      });
      console.log('Result =>', result);
    } catch (error) {
      console.log('onStartRecord Error =>', error);
    }
  };

  const onPauseRecord = async () => {
    try {
      const result = await audioRecorderPlayer.pauseRecorder();
      console.log('Result =>', result);
    } catch (error) {
      console.log('onPauseRecord Error =>', error);
    }
  };

  const onResumeRecord = async () => {
    try {
      const result = await audioRecorderPlayer.resumeRecorder();
      console.log('Result =>', result);
    } catch (error) {
      console.log('onResumeRecord Error =>', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      setRecordPath(result);
      console.log('Result =>', result);
    } catch (error) {
      console.log('onStopRecord Error =>', error);
    }
  };

  const onStartPlay = async () => {
    try {
      console.log('onStartPlay');
      const msg = await audioRecorderPlayer.startPlayer();
      audioRecorderPlayer.setVolume(1.0);
      console.log(msg);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          console.log('finished');
          audioRecorderPlayer.stopPlayer();
        }
        setCurrentPositionSec(e.duration);
        setCurrentDurationSec(e.currentPosition);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
    } catch (error) {
      console.log('onStartPlay Error =>', error);
    }
  };

  const onPausePlay = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
    } catch (error) {
      console.log('onPausePlay Error =>', error);
    }
  };

  const onResumePlay = async () => {
    try {
      await audioRecorderPlayer.resumePlayer();
    } catch (error) {
      console.log('onResumePlay Error =>', error);
    }
  };

  const onStopPlay = async () => {
    try {
      console.log('onStopPlay');
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.log('onStopPlay Error =>', error);
    }
  };

  {
    /* Sound Player */
  }
  const loadSound = () => {
    try {
      setIsLoading(true);
      setIsPlaying(false);
      SoundPlayer.loadUrl(
        recordPath
          ? recordPath
          : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('loadSound Error =>', error);
    }
  };

  const playSound = () => {
    try {
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

  const stopSound = () => {
    try {
      SoundPlayer.stop();
      setIsPlaying(false);
    } catch (error) {
      console.log('stopSound Error =>', error);
    }
  };

  const resumeSound = () => {
    try {
      if (!isPlaying) {
        SoundPlayer.resume();
        setIsPlaying(true);
      }
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
            iconType={'Entypo'}
            name="shuffle"
            size={24}
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
            name="pausecircle"
            size={50}
            color={appColors.primary}
          />
          <TouchableIcon
            iconType={'Entypo'}
            name="controller-fast-forward"
            size={24}
            color={appColors.primary}
          />
          <TouchableIcon
            iconType={'Feather'}
            name="repeat"
            size={20}
            color={appColors.primary}
          />
        </View>
        <Text>Audio</Text>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onStartRecord}>
          <Text>start record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onPauseRecord}>
          <Text>pause record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onResumeRecord}>
          <Text>resume record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onStopRecord}>
          <Text>stop record</Text>
        </TouchableOpacity>
        <View style={{borderWidth: 1, width: '100%', borderColor: '#000'}} />
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onStartPlay}>
          <Text>start play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onPausePlay}>
          <Text>pause play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onResumePlay}>
          <Text>resume play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerStyle}
          onPress={onStopPlay}>
          <Text>stop play</Text>
        </TouchableOpacity>
        <Text>recordSecs: {recordSecs}</Text>
        <Text>recordTime: {recordTime}</Text>
        <Text>currentPositionSec: {currentPositionSec}</Text>
        <Text>currentDurationSec: {currentDurationSec}</Text>
        <Text>duration: {duration}</Text>
        <Text>playTime: {playTime}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={loadSound}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Load Sound</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={playSound}
          disabled={isPlaying}>
          <Text style={styles.buttonText}>Play Sound</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={pauseSound}
          disabled={!isPlaying}>
          <Text style={styles.buttonText}>Pause Sound</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={stopSound}
          disabled={!isPlaying}>
          <Text style={styles.buttonText}>Stop Sound</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resumeSound}>
          <Text style={styles.buttonText}>Resume Sound</Text>
        </TouchableOpacity>

        <Text style={styles.status}>
          {isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Stopped'}
        </Text>

        <Text>{recordPath}</Text>
      </ScrollView>
    </View>
  );
};

export default Audio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  buttonContainerStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
  button: {
    backgroundColor: appColors.primary,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
  },
  mainbar: {
    height: height * 0.1,
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
  musicLogoView: {
    height: height * 0.3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: '100%',
    width: '80%',
    borderRadius: 10,
  },
  nameOfSongView: {
    height: height * 0.15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameOfSongText1: {
    fontSize: 19,
    fontWeight: 'bold',
    color: appColors.black80,
  },
  nameOfSongText2: {
    color: appColors.black60,
    marginTop: '4%',
  },
  sliderView: {
    height: height * 0.1,
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
    width: '15%',
    textAlign: 'center',
  },
  functionsView: {
    flexDirection: 'row',
    height: height * 0.1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});
