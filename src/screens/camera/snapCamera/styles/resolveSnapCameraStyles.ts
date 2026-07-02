import type {ThemeTokens} from '@theme/types';

export const resolveSnapCameraStyles = (tokens: ThemeTokens) => ({
    root: {flex: tokens.layout.flex.fill, backgroundColor: tokens.colors.cameraBackground},
    topBar: {
      position: tokens.layout.position.absolute,
      left: tokens.spacing.lg,
      right: tokens.spacing.lg,
      zIndex: tokens.layout.zIndex.sticky,
      ...tokens.layout.presets.rowBetween,
    },
    filterRail: {
      position: tokens.layout.position.absolute,
      left: 0,
      right: 0,
      paddingHorizontal: tokens.spacing.md,
    },
    filterChip: {
      width: tokens.sizes.filterChip,
      height: tokens.sizes.filterChip,
      borderRadius: tokens.radius.full,
      ...tokens.layout.presets.center,
      marginRight: tokens.spacing.sm,
      backgroundColor: tokens.colors.cameraControlSurface,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.transparent,
    },
    filterChipActive: {
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.cameraControlActive,
    },
    shutterRow: {
      position: tokens.layout.position.absolute,
      left: 0,
      right: 0,
      ...tokens.layout.presets.rowCenter,
    },
    shutter: {
      width: tokens.sizes.shutterOuter,
      height: tokens.sizes.shutterOuter,
      borderRadius: tokens.sizes.shutterOuter / 2,
      borderWidth: tokens.layout.borderWidth.lg,
      borderColor: tokens.colors.cameraShutterBorder,
      backgroundColor: tokens.colors.cameraShutterFill,
    },
    shutterDisabled: {opacity: 0.5},
    overlayText: {color: tokens.colors.cameraForeground},
  });
