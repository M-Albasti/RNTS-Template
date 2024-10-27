import {Platform, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoCameraModal from '../../organisms/videos/VideoCameraModal';
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
import TextView from '@atoms/TextView';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideoRecord {
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const VideoRecord = (props: VideoRecord): React.JSX.Element => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [cameraFlash, setCameraFlash] = useState<'on' | 'off'>('off');
  const [videoFile, setVideoFile] = useState<VideoFile | null>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioEnable, setAudioEnable] = useState<boolean>(true);
  const [cameraVisible, setCameraVisible] = useState<boolean>(true);
  const device: CameraDevice | undefined = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera | null>();
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
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    }
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

  if (device == null) {
    return (
      <TextView
        text={'No Supported Device!'}
        style={styles.noDeviceText}
        containerStyle={styles.noDeviceContainer}
      />
    );
  }

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
      </View>
    );
  } else {
    return (
      <TextView
        text={'No Camera Permission !!'}
        containerStyle={styles.permissionContainer}
        style={styles.permissionText}
      />
    );
  }
};

export default VideoRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    textAlign: 'right',
    fontSize: 25,
    fontWeight: 'bold',
  },
  noDeviceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDeviceText: {
    textAlign: 'right',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
