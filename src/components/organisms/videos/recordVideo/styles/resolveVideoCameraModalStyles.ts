import type {ThemeTokens} from '@theme/types';

export const resolveVideoCameraModalStyles = (tokens: ThemeTokens) => ({
    permissionContainer: {
      ...tokens.layout.presets.fill,
      ...tokens.layout.presets.center,
    },
    permissionText: {
      ...tokens.layout.presets.textRight,
      ...tokens.typography.title,
    },
    noDeviceContainer: {
      ...tokens.layout.presets.fill,
      ...tokens.layout.presets.center,
    },
    noDeviceText: {
      ...tokens.layout.presets.textRight,
      ...tokens.typography.title,
    },
  });
