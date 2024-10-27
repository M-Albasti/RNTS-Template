import React from 'react';
import ModalLayout from '../../atoms/ModalLayout';
import {Camera, CameraDevice, CameraPosition} from 'react-native-vision-camera';
import VideoCamera from '../../molecules/videos/VideoCamera';

interface VideoCameraModalProps {
  device: CameraDevice;
  cameraVisible: boolean;
  audio: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
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
  startRecording,
  stopRecording,
  cameraPosition,
  cameraFlash,
  transparent,
  cameraToggle,
  onCameraReady,
  changeCameraPosition,
  flashToggle,
  audioToggle,
}: VideoCameraModalProps) => {
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
        startRecording={startRecording}
        stopRecording={stopRecording}
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
