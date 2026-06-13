/**
 * Default Remote Config values used before Firebase fetch completes
 * and as fallbacks when a key is missing in the console.
 */
export const REMOTE_CONFIG_DEFAULTS = {
  camera_snap_enabled: true,
  camera_qr_enabled: true,
  camera_barcode_enabled: true,
  maintenance_mode: false,
  maintenance_message: '',
  welcome_message: 'Welcome to RNTS Template',
  min_app_version: '1.0.0',
} as const;

export type RemoteConfigKey = keyof typeof REMOTE_CONFIG_DEFAULTS;

export type RemoteConfigValues = {
  camera_snap_enabled: boolean;
  camera_qr_enabled: boolean;
  camera_barcode_enabled: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  welcome_message: string;
  min_app_version: string;
};
