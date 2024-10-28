import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {
  Camera,
  CameraRuntimeError,
  CameraProps,
} from 'react-native-vision-camera';

interface VisionCameraProps extends CameraProps {
  onCameraReady: (ref: Camera | null) => void;
}

const VisionCamera = ({
  device,
  video,
  photo,
  audio,
  torch,
  focusable,
  resizeMode,
  isActive,
  enableZoomGesture,
  onCameraReady,
}: VisionCameraProps): React.JSX.Element => {
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  return (
    <Camera
      ref={ref => onCameraReady(ref)}
      style={StyleSheet.absoluteFill}
      device={device}
      video={video}
      audio={audio}
      photo={photo}
      torch={device.hasTorch ? torch : 'off'}
      onError={onError}
      photoQualityBalance={'speed'}
      focusable={focusable}
      resizeMode={resizeMode}
      lowLightBoost={device.supportsLowLightBoost}
      enableZoomGesture={enableZoomGesture}
      isActive={isActive}
    />
  );
};

export default VisionCamera;
