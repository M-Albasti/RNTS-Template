import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Camera,
  CameraPosition,
  CameraRuntimeError,
  VideoFile,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {permissionsRequest} from '@services/permissionsRequest';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '@constants/colors';

const {width, height} = Dimensions.get('screen');

const Video = (props: any) => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [cameraFlash, setCameraFlash] = useState<'on' | 'off'>('off');
  const [video, setVideo] = useState<VideoFile | null>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera | null>();

  useEffect(() => {
    requestCameraPermission();
  }, []);

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

  const requestCameraPermission = () => {
    if (
      !cameraPermission.hasPermission ||
      !microphonePermission.hasPermission
    ) {
      permissionsRequest('camera');
    }
  };

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

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
            setVideo(video);
          } else {
            setVideo(video);
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
    setVideo(null);
    setIsRecording(false);
  };

  const onAcceptVideo = () => {
    // onSuccess({...video, mime: 'video/mp4'});
  };

  const onCameraReady = (ref: Camera | null) => {
    cameraRef.current = ref;
  };

  if (device == null) {
    return (
      <View>
        <Text>No Camera Device Detected !!</Text>
      </View>
    );
  }

  if (cameraPermission.hasPermission && microphonePermission.hasPermission) {
    return (
      <View style={{flex: 1}}>
        <Camera
          ref={ref => onCameraReady(ref)}
          style={StyleSheet.absoluteFill}
          device={device}
          video={true}
          audio={true}
          torch={cameraFlash}
          onError={onError}
          focusable={true}
          resizeMode="contain"
          lowLightBoost={device.supportsLowLightBoost}
          enableZoomGesture={cameraPosition == 'back'}
          isActive={true}
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: 'white',
            padding: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: width,
            position: 'absolute',
            bottom: 0,
          }}>
          <TouchableOpacity
            style={{borderWidth: 1, borderColor: 'red'}}
            onPress={changeCameraPosition}>
            <Ionicons name="camera-reverse" size={35} color={appColors.white} />
          </TouchableOpacity>
          {device.hasTorch && (
            <TouchableOpacity
              style={{borderWidth: 1, borderColor: 'red'}}
              onPress={flashToggle}>
              <Ionicons
                name={cameraFlash == 'on' ? 'flash' : 'flash-off'}
                size={35}
                color={appColors.white}
              />
            </TouchableOpacity>
          )}
        </View>
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

export default Video;

const styles = StyleSheet.create({});
