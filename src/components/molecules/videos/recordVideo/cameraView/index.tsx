import React from 'react';
import {View} from 'react-native';
import {Camera, CameraDevice, CameraPosition} from 'react-native-vision-camera';
import {ScreenWidth} from '@rneui/base';

import VisionCamera from '@atoms/VisionCamera';
import TouchableIcon from '@atoms/TouchableIcon';
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveCameraViewStyles} from './styles/resolveCameraViewStyles';

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
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveCameraViewStyles);

  return (
    <View style={styles.cameraContainer}>
      <VisionCamera
        onCameraReady={onCameraReady}
        device={device}
        isActive={cameraActive}
        torch={cameraFlash}
        video={video}
        audio={audio}
        enableZoomGesture={cameraPosition === 'back'}
      />
      <View style={styles.topButtonsContainer}>
        <TouchableIcon
          iconType={'Ionicons'}
          name={'camera-reverse'}
          size={sizes.recordIcon}
          color={colors.cameraForeground}
          onPress={changeCameraPosition}
        />
        <TouchableIcon
          iconType={'Ionicons'}
          name={'close-circle-sharp'}
          size={sizes.recordIcon}
          color={colors.cameraForeground}
          onPress={closeCamera}
        />
      </View>
      <View style={styles.bottomButtonsContainer}>
        <TouchableIcon
          iconType={'Ionicons'}
          name={audio ? 'mic-off-sharp' : 'mic'}
          size={sizes.recordIcon}
          color={colors.cameraForeground}
          onPress={audioToggle}
        />
        <TouchableIcon
          iconType={isRecording ? 'Ionicons' : 'MaterialCommunityIcons'}
          name={isRecording ? 'stop-circle-outline' : 'record-circle'}
          size={sizes.recordIcon}
          color={colors.cameraForeground}
          onPress={isRecording ? stopRecording : startRecording}
        />
        {device.hasTorch ? (
          <TouchableIcon
            iconType={'Ionicons'}
            name={cameraFlash === 'on' ? 'flash-off' : 'flash'}
            size={sizes.recordIcon}
            color={colors.cameraForeground}
            onPress={flashToggle}
          />
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

export default CameraView;
