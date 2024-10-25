import {Platform, PermissionsAndroid} from 'react-native';
import {Camera} from 'react-native-vision-camera';

interface PermissionsRequestProps {
  permissionType: 'microphone' | 'camera';
}

export const permissionsRequest = async (
  permissionType: PermissionsRequestProps['permissionType'],
) => {
  if (Platform.OS === 'android' && permissionType == 'microphone') {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return grants;
      } else {
        return grants;
      }
    } catch (err) {
      console.warn(err);
      return 'denied';
    }
  }
  if (permissionType == 'camera') {
    await Camera.requestCameraPermission().then(async () => {
      await Camera.requestMicrophonePermission();
    });
  }
};
