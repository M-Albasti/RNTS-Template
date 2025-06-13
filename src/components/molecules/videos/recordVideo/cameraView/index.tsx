//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, CameraDevice, CameraPosition} from 'react-native-vision-camera';
import {ScreenWidth} from '@rneui/base';

//* components import
import VisionCamera from '@atoms/VisionCamera';
import TouchableIcon from '@atoms/TouchableIcon';

//* constants import
import {appColors} from '@constants/colors';

interface VideoCameraProps {
  device: CameraDevice;
  cameraPosition?: CameraPosition;
  cameraFlash?: 'on' | 'off';
  cameraActive: boolean;
  video: boolean;
  audio: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  onCameraReady: (ref: Camera | null) => void;
  changeCameraPosition: () => void;
  flashToggle: () => void;
  audioToggle: () => void;
  closeCamera: () => void;
}

const CameraView = ({
  device,
  cameraPosition = 'back',
  cameraFlash = 'off',
  cameraActive,
  video,
  audio,
  isRecording,
  startRecording,
  stopRecording,
  onCameraReady,
  changeCameraPosition,
  flashToggle,
  audioToggle,
  closeCamera,
}: VideoCameraProps): React.JSX.Element => {
  return (
    <View style={styles.cameraContainer}>
      <VisionCamera
        onCameraReady={onCameraReady}
        device={device}
        isActive={cameraActive}
        torch={cameraFlash}
        video={video}
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
          onPress={closeCamera}
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

export default CameraView;

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  topButtonsContainer: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: ScreenWidth,
    backgroundColor: appColors.black60,
  },
  bottomButtonsContainer: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: ScreenWidth,
    backgroundColor: appColors.black60,
    position: 'absolute',
    bottom: 0,
  },
});
