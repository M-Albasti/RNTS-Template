import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoCameraModal from '../organisms/VideoCameraModal';
import {
  Camera,
  CameraDevice,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  VideoFile,
} from 'react-native-vision-camera';
import {permissionsRequest} from '@services/permissionsRequest';
import VideoPlayer from '../atoms/VideoPlayer';
import {VideoRef} from 'react-native-video';
import {appColors} from '@constants/colors';
import TouchableTextIcon from '../molecules/TouchableTextIcon';

const VideoRecord = (): React.JSX.Element => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [cameraFlash, setCameraFlash] = useState<'on' | 'off'>('off');
  const [videoFile, setVideoFile] = useState<VideoFile | null>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioEnable, setAudioEnable] = useState<boolean>(false);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(true);
  const [repeat, setRepeat] = useState<boolean>(true);
  const device: CameraDevice | undefined = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera | null>();
  const videoRef = useRef<VideoRef | null>();
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = () => {
    if (
      !cameraPermission.hasPermission ||
      !microphonePermission.hasPermission
    ) {
      permissionsRequest('camera');
    }
  };

  const onCameraReady = (ref: Camera | null) => {
    cameraRef.current = ref;
  };

  const onVideoReady = (ref: VideoRef) => {
    videoRef.current = ref;
  };

  const changeCameraPosition = () => {
    if (cameraPosition == 'back') {
      setCameraFlash('off');
      setCameraPosition('front');
    } else {
      setCameraPosition('back');
    }
  };

  const flashToggle = () => {
    if (cameraFlash == 'on') {
      setCameraFlash('off');
    } else {
      setCameraFlash('on');
    }
  };

  const cameraToggle = () => {
    setCameraFlash('off');
    setCameraVisible(!cameraVisible);
  };

  const audioToggle = () => {
    setAudioEnable(!audioEnable);
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.startRecording({
        fileType: 'mp4',
        flash: cameraFlash,
        onRecordingError: error => {
          console.error('Recording failed! onRecordingError=>', error);
        },
        onRecordingFinished: video => {
          if (Platform.OS === 'android') {
            video.path = `file://${video?.path}`;
            setVideoFile(video);
          } else {
            setVideoFile(video);
          }
          console.log('onRecordingFinished=>', {video});
        },
      });
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(false);
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const onRejectVideo = () => {
    setVideoFile(null);
    setIsRecording(false);
  };

  const onAcceptVideo = () => {
    // onSuccess({...video, mime: 'video/mp4'});
  };

  const onReadyForDisplay = () => {
    setVideoReady(false);
  };

  const videoPause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const videoResume = () => {
    if (videoRef.current) {
      videoRef.current.resume();
    }
  };

  const videoDismissFullScreen = () => {
    if (videoRef.current) {
      setFullscreen(false);
      videoRef.current.dismissFullscreenPlayer();
    }
  };

  const videoPresentFullScreen = () => {
    if (videoRef.current) {
      setFullscreen(true);
      videoRef.current.presentFullscreenPlayer();
    }
  };

  if (cameraPermission.hasPermission && microphonePermission.hasPermission) {
    return (
      <View style={styles.container}>
        <VideoCameraModal
          device={device}
          cameraVisible={cameraVisible}
          audio={audioEnable}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          cameraPosition={cameraPosition}
          cameraToggle={cameraToggle}
          audioToggle={audioToggle}
          onCameraReady={onCameraReady}
          changeCameraPosition={changeCameraPosition}
          flashToggle={flashToggle}
          cameraFlash={cameraFlash}
        />
        {!cameraVisible && (
          <VideoPlayer
            // uri={videoFile?.path}
            uri={
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            }
            onVideoReady={onVideoReady}
            onReadyForDisplay={onReadyForDisplay}
            fullscreen={fullscreen}
            repeat={repeat}
            controls={true}
          />
        )}
        {videoReady && videoFile?.path && (
          <ActivityIndicator
            color={appColors.green}
            size={'large'}
            style={StyleSheet.absoluteFill}
          />
        )}
        <TouchableTextIcon
          iconType={'FontAwesome5'}
          name={'camera-retro'}
          size={35}
          color={appColors.black}
          onPress={cameraToggle}
          style={styles.cameraIcon}
        />
      </View>
    );
  } else {
    return (
      <View>
        <Text>No Camera Permission !!</Text>
      </View>
    );
  }
};

export default VideoRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraIcon: {
    alignSelf: 'center',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
