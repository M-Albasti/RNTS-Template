//* packages import
import React, {useLayoutEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {
  Camera,
  CameraDevice,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  VideoFile,
} from 'react-native-vision-camera';

//* components import
import CameraModal from '@organisms/videos/recordVideo/CameraModal';
import TextView from '@atoms/TextView';

//* helpers import
import {permissionsRequest} from '@helpers/permissionsRequest';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideoRecordProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
  setVideoFile: (video: VideoFile) => void;
}

const Recorder = (props: VideoRecordProps): React.JSX.Element => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [cameraFlash, setCameraFlash] = useState<'on' | 'off'>('off');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioEnable, setAudioEnable] = useState<boolean>(true);
  const [cameraVisible, setCameraVisible] = useState<boolean>(true);
  const device: CameraDevice | undefined = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera | null>();
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  useLayoutEffect(() => {
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
            props.setVideoFile(video);
          } else {
            props.setVideoFile(video);
          }
          setCameraFlash('off');
          setCameraVisible(!cameraVisible);
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
    }
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
        <CameraModal
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

export default Recorder;

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
