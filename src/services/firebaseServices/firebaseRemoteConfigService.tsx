import remoteConfig from '@react-native-firebase/remote-config';

import {
  REMOTE_CONFIG_DEFAULTS,
  type RemoteConfigKey,
  type RemoteConfigValues,
} from '@config/firebaseRemoteConfigDefaults';

let cachedValues: RemoteConfigValues = {...REMOTE_CONFIG_DEFAULTS};

const readBoolean = (key: RemoteConfigKey): boolean =>
  remoteConfig().getValue(key).asBoolean();

const readString = (key: RemoteConfigKey): string =>
  remoteConfig().getValue(key).asString();

const syncCachedValues = (): RemoteConfigValues => {
  cachedValues = {
    camera_snap_enabled: readBoolean('camera_snap_enabled'),
    camera_qr_enabled: readBoolean('camera_qr_enabled'),
    camera_barcode_enabled: readBoolean('camera_barcode_enabled'),
    maintenance_mode: readBoolean('maintenance_mode'),
    maintenance_message: readString('maintenance_message'),
    welcome_message: readString('welcome_message'),
    min_app_version: readString('min_app_version'),
  };
  return cachedValues;
};

export const initRemoteConfig = async (): Promise<RemoteConfigValues> => {
  try {
    await remoteConfig().setDefaults(REMOTE_CONFIG_DEFAULTS);
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
    });
    await remoteConfig().fetchAndActivate();
  } catch (error) {
    console.log('Firebase Remote Config init Error =>', error);
  }

  return syncCachedValues();
};

export const getRemoteConfigValues = (): RemoteConfigValues => cachedValues;

export const refreshRemoteConfig = async (): Promise<RemoteConfigValues> => {
  try {
    await remoteConfig().fetchAndActivate();
  } catch (error) {
    console.log('Firebase Remote Config refresh Error =>', error);
  }

  return syncCachedValues();
};

export const getRemoteConfigBoolean = (key: RemoteConfigKey): boolean =>
  getRemoteConfigValues()[key] as boolean;

export const getRemoteConfigString = (key: RemoteConfigKey): string =>
  String(getRemoteConfigValues()[key]);
