import React, {RefObject} from 'react';
import ModalLayout from '../atoms/ModalLayout';
import {Camera, CameraDevice, CameraPosition} from 'react-native-vision-camera';
import TextView from '../atoms/TextView';
import VideoCamera from '../molecules/VideoCamera';

interface VideoCameraModalProps {
  device: CameraDevice | undefined | null;
  cameraVisible: boolean;
  audio: boolean;
  isRecording: boolean;
  cameraPosition: CameraPosition;
  cameraFlash?: 'on' | 'off';
  transparent?: boolean;
  cameraToggle: () => void;
  onCameraReady: (ref: Camera | null) => void;
  changeCameraPosition: () => void;
  flashToggle: () => void;
  audioToggle: () => void;
}

const VideoCameraModal = ({
  device,
  cameraVisible,
  audio,
  isRecording,
  cameraPosition,
  cameraFlash,
  transparent,
  cameraToggle,
  onCameraReady,
  changeCameraPosition,
  flashToggle,
  audioToggle,
}: VideoCameraModalProps) => {
  if (device == null) {
    return <TextView />;
  }

  return (
    <ModalLayout
      visible={cameraVisible}
      transparent={transparent}
      onRequestClose={cameraToggle}
      onDismiss={cameraToggle}>
      <VideoCamera
        device={device}
        onCameraReady={onCameraReady}
        cameraActive={cameraVisible}
        audio={audio}
        isRecording={isRecording}
        cameraFlash={cameraFlash}
        cameraPosition={cameraPosition}
        changeCameraPosition={changeCameraPosition}
        flashToggle={flashToggle}
        audioToggle={audioToggle}
        cameraToggle={cameraToggle}
      />
    </ModalLayout>
  );
};

export default VideoCameraModal;
