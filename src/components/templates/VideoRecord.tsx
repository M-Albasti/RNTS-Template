import {Platform, StyleSheet, Text, View} from 'react-native';
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

const VideoRecord = () => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [cameraFlash, setCameraFlash] = useState<'on' | 'off'>('off');
  const [videoFile, setVideoFile] = useState<VideoFile | null>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioEnable, setAudioEnable] = useState<boolean>(false);
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
    console.log('🚀 ~ onCameraReady ~ cameraRef.current:', cameraRef.current);
  };

  const changeCameraPosition = () => {
    if (cameraPosition == 'back') {
      flashToggle();
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
    flashToggle();
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
          // console.log('try-catch error=>', {error});
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
  if (cameraPermission.hasPermission && microphonePermission.hasPermission) {
    return (
      <View>
        <VideoCameraModal
          device={device}
          cameraVisible={cameraVisible}
          audio={audioEnable}
          isRecording={isRecording}
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
      <View>
        <Text>No Camera Permission !!</Text>
      </View>
    );
  }
};

export default VideoRecord;

const styles = StyleSheet.create({});
