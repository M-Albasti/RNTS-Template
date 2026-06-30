import type {ThemeTokens} from '@theme/types';

export const resolveLiveDeliveryMapStyles = (tokens: ThemeTokens) => ({
    root: {flex: tokens.layout.flex.fill, backgroundColor: tokens.colors.cameraBackground},
    header: {
      position: tokens.layout.position.absolute,
      top: 0,
      left: 0,
      right: 0,
      zIndex: tokens.layout.zIndex.overlay,
      paddingHorizontal: tokens.spacing.md,
    },
    footer: {
      position: tokens.layout.position.absolute,
      bottom: 0,
      left: 0,
      right: 0,
      padding: tokens.spacing.md,
    },
    empty: {
      flex: tokens.layout.flex.fill,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
