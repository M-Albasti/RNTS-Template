import type {ThemeTokens} from '@theme/types';

export const resolveGalleryGridStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      tile: {
        flex: tokens.layout.flex.fill,
        margin: tokens.spacing.xs,
        borderRadius: tokens.radius.md,
        overflow: tokens.layout.overflow.hidden,
        aspectRatio: 1,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      image: {width: '100%', height: '100%'},
      overlay: {
        position: tokens.layout.position.absolute,
        left: 0,
        right: 0,
        bottom: 0,
        padding: tokens.spacing.xs,
        backgroundColor: tokens.colors.overlay,
      },
      overlayText: {color: tokens.colors.textInverse},
    });
