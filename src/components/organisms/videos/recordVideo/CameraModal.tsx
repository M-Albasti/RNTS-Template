//* packages import
import React from 'react';
import {Camera, CameraDevice, CameraPosition} from 'react-native-vision-camera';

//* components import
import ModalLayout from '@atoms/ModalLayout';
import CameraView from '@molecules/Videos/recordVideo/CameraView';

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

const CameraModal = ({
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
}: VideoCameraModalProps): React.JSX.Element => {
  return (
    <ModalLayout
      visible={cameraVisible}
      transparent={transparent}
      onRequestClose={cameraToggle}
      onDismiss={cameraToggle}>
      <CameraView
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

export default CameraModal;
