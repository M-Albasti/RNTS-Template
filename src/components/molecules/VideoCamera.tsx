import React, {RefObject} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import VisionCamera from '../atoms/VisionCamera';
import {Camera, CameraDevice, CameraPosition} from 'react-native-vision-camera';
import TextView from '../atoms/TextView';
import TouchableIcon from './TouchableIcon';
import {appColors} from '@constants/colors';

const {width, height} = Dimensions.get('screen');

interface VideoCameraProps {
  device: CameraDevice | undefined | null;
  cameraPosition?: CameraPosition;
  cameraFlash?: 'on' | 'off';
  cameraActive: boolean;
  audio: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  onCameraReady: (ref: Camera | null) => void;
  changeCameraPosition: () => void;
  flashToggle: () => void;
  audioToggle: () => void;
  cameraToggle: () => void;
}

const VideoCamera = ({
  device,
  cameraPosition = 'back',
  cameraFlash = 'off',
  cameraActive,
  audio,
  isRecording,
  startRecording,
  stopRecording,
  onCameraReady,
  changeCameraPosition,
  flashToggle,
  audioToggle,
  cameraToggle,
}: VideoCameraProps) => {
  if (device == null) {
    return <TextView />;
  }

  return (
    <View style={styles.cameraContainer}>
      <VisionCamera
        onCameraReady={onCameraReady}
        device={device}
        isActive={cameraActive}
        torch={cameraFlash}
        video={true}
        audio={audio}
        enableZoomGesture={cameraPosition == 'back'}
      />
      <View style={styles.topButtonsContainer}>
        <TouchableIcon
          iconType={'Ionicons'}
          name={'camera-reverse'}
          size={35}
          color={appColors.white}
          onPress={changeCameraPosition}
        />
        <TouchableIcon
          iconType={'Ionicons'}
          name={'close-circle-sharp'}
          size={35}
          color={appColors.white}
          onPress={cameraToggle}
        />
      </View>
      <View style={styles.bottomButtonsContainer}>
        <TouchableIcon
          iconType={'Ionicons'}
          name={audio ? 'mic-off-sharp' : 'mic'}
          size={35}
          color={appColors.white}
          onPress={audioToggle}
        />
        <TouchableIcon
          iconType={isRecording ? 'Ionicons' : 'MaterialCommunityIcons'}
          name={isRecording ? 'stop-circle-outline' : 'record-circle'}
          size={35}
          color={appColors.white}
          onPress={isRecording ? stopRecording : startRecording}
        />
        {device.hasTorch ? (
          <TouchableIcon
            iconType={'Ionicons'}
            name={cameraFlash == 'on' ? 'flash-off' : 'flash'}
            size={35}
            color={appColors.white}
            onPress={flashToggle}
          />
        ) : (
          <View style={{width: 35}} />
        )}
      </View>
    </View>
  );
};

export default VideoCamera;

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  topButtonsContainer: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: width,
    backgroundColor: appColors.black60,
  },
  bottomButtonsContainer: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: width,
    backgroundColor: appColors.black60,
    position: 'absolute',
    bottom: 0,
  },
});
