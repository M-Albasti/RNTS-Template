import {CameraRoll} from '@react-native-camera-roll/camera-roll';

/** Vision Camera returns a filesystem path; CameraRoll expects a file URI. */
export const toPhotoUri = (path: string): string =>
  path.startsWith('file://') ? path : `file://${path}`;

export const savePhotoToGallery = async (path: string): Promise<void> => {
  await CameraRoll.saveAsset(toPhotoUri(path), {type: 'photo'});
};
