import type {ThemeTokens} from '@theme/types';

export const resolveQrScannerStyles = (tokens: ThemeTokens) => ({
    root: {flex: tokens.layout.flex.fill, backgroundColor: tokens.colors.cameraBackground},
    header: {
      position: tokens.layout.position.absolute,
      top: 0,
      left: 0,
      right: 0,
      zIndex: tokens.layout.zIndex.sticky,
      paddingHorizontal: tokens.spacing.lg,
    },
    frame: {
      position: tokens.layout.position.absolute,
      top: '30%' as const,
      left: '15%' as const,
      width: '70%' as const,
      height: '30%' as const,
      borderWidth: tokens.layout.borderWidth.lg,
      borderColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
    },
    hint: {
      position: tokens.layout.position.absolute,
      left: tokens.spacing.lg,
      right: tokens.spacing.lg,
    },
    hintText: {color: tokens.colors.cameraForeground},
  });
