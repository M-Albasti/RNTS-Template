import {ScreenWidth} from '@rneui/base';

import type {ThemeTokens} from '@theme/types';

export const resolveCameraViewStyles = (tokens: ThemeTokens) => ({
  cameraContainer: {
    flex: tokens.layout.flex.fill,
  },
  topButtonsContainer: {
    padding: tokens.spacing.sm,
    ...tokens.layout.presets.rowBetween,
    width: ScreenWidth,
    backgroundColor: tokens.colors.mediaOverlay,
  },
  bottomButtonsContainer: {
    padding: tokens.spacing.sm,
    ...tokens.layout.presets.rowBetween,
    width: ScreenWidth,
    backgroundColor: tokens.colors.mediaOverlay,
    position: tokens.layout.position.absolute,
    bottom: 0,
  },
  iconPlaceholder: {
    width: tokens.sizes.recordIcon,
  },
});
