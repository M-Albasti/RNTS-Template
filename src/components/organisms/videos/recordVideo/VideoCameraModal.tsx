//* packages import
import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {
  Camera,
  CameraDevice,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  VideoFile,
} from 'react-native-vision-camera';
import {isEmpty} from 'lodash';

//* components import
import ModalLayout from '@atoms/ModalLayout';
import CameraView from '@molecules/Videos/recordVideo/CameraView';
import TextView from '@atoms/TextView';
import VideoWithButtons from './VideoWithButtons';

//* helpers import
import {permissionsRequest} from '@helpers/permissionsRequest';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideoCameraModalProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const VideoCameraModal = (props: VideoCameraModalProps): React.JSX.Element => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [cameraFlash, setCameraFlash] = useState<'on' | 'off'>('off');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioEnable, setAudioEnable] = useState<boolean>(true);
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const device: CameraDevice | undefined = useCameraDevice(cameraPosition);
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();
  const cameraRef = useRef<Camera | null>();

  useLayoutEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (
      !cameraPermission.hasPermission ||
      !microphonePermission.hasPermission
    ) {
      await permissionsRequest('camera');
    }
  };

  const onCameraReady = useCallback((ref: Camera | null) => {
    cameraRef.current = ref;
  }, []);

  const changeCameraPosition = () => {
    if (cameraPosition === 'back') {
      setCameraFlash('off');
    }
    setCameraPosition(position => (position === 'back' ? 'front' : 'back'));
  };

  const flashToggle = () => {
    setCameraFlash(flash => (flash === 'on' ? 'off' : 'on'));
  };

  const closeCamera = () => {
    // close the camera and hide the camera modal
    setCameraFlash('off');
    goBack();
  };

  const goBack = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    }
  };

  const audioToggle = () => {
    setAudioEnable(!audioEnable);
  };

  const startRecording = async () => {
    try {
      if (cameraRef?.current) {
        cameraRef?.current?.startRecording({
          fileType: 'mp4',
          flash: cameraFlash,
          onRecordingError: error => {
            console.error('Recording failed! onRecordingError=>', error);
          },
          onRecordingFinished: video => {
            normalizeVideoPath(video);
            setCameraFlash('off');
            console.log('onRecordingFinished=>', {video});
          },
        });
        setIsRecording(true);
      }
    } catch (error) {
      console.log('Start Recording Error:', error);
    }
  };

  const normalizeVideoPath = (video: VideoFile) => {
    const normalized =
      Platform.OS === 'android'
        ? {...video, path: `file://${video?.path}`}
        : video;
    setVideoFile(normalized);
  };

  const stopRecording = async () => {
    try {
      if (cameraRef?.current) {
        setIsRecording(false);
        await cameraRef?.current?.stopRecording();
      }
    } catch (error) {
      console.log('Stop Recording Error:', error);
    }
  };

  const emptyVideoFile = () => {
    setVideoFile(null);
  };

  const retakeVideo = () => {
    setVideoFile(null);
  };

  if (isEmpty(device)) {
    return (
      <TextView
        text={'No Supported Device!'}
        style={styles.noDeviceText}
        containerStyle={styles.noDeviceContainer}
      />
    );
  }

  if (!cameraPermission.hasPermission || !microphonePermission.hasPermission) {
    return (
      <TextView
        text={'No Camera Permission !!'}
        containerStyle={styles.permissionContainer}
        style={styles.permissionText}
      />
    );
  }

  if (!isEmpty(videoFile)) {
    return (
      <VideoWithButtons
        videoFile={videoFile}
        emptyVideoFile={emptyVideoFile}
        retakeVideo={retakeVideo}
        navigation={props.navigation}
      />
    );
  }

  return (
    <ModalLayout
      visible={true}
      transparent={false}
      onRequestClose={closeCamera}
      onDismiss={closeCamera}>
      <CameraView
        device={device}
        onCameraReady={onCameraReady}
        cameraActive={true}
        video={true}
        audio={audioEnable}
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        cameraFlash={cameraFlash}
        cameraPosition={cameraPosition}
        changeCameraPosition={changeCameraPosition}
        flashToggle={flashToggle}
        audioToggle={audioToggle}
        closeCamera={closeCamera}
      />
    </ModalLayout>
  );
};

export default VideoCameraModal;

const styles = StyleSheet.create({
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
