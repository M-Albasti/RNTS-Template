import type {ThemeTokens} from '@theme/types';

export const resolveBarcodeScannerStyles = (tokens: ThemeTokens) => ({
    root: {flex: tokens.layout.flex.fill, backgroundColor: tokens.colors.cameraBackground},
    header: {
      position: tokens.layout.position.absolute,
      top: 0,
      left: 0,
      right: 0,
      zIndex: tokens.layout.zIndex.sticky,
      paddingHorizontal: tokens.spacing.lg,
    },
    line: {
      position: tokens.layout.position.absolute,
      top: '45%' as const,
      left: '8%' as const,
      width: '84%' as const,
      height: tokens.sizes.markerLine,
      backgroundColor: tokens.colors.primary,
    },
    hint: {
      position: tokens.layout.position.absolute,
      left: tokens.spacing.lg,
      right: tokens.spacing.lg,
    },
    hintText: {color: tokens.colors.cameraForeground},
  });
