import type {ThemeTokens} from '@theme/types';

export const resolveGalleryAlbumsStyles = (tokens: ThemeTokens) => ({
      cover: {
        width: tokens.sizes.galleryCover,
        height: tokens.sizes.galleryCover,
        borderRadius: tokens.radius.md,
      },
      row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      meta: {flex: tokens.layout.flex.fill},
      tile: {
        flex: tokens.layout.flex.fill,
        margin: tokens.spacing.xs,
        borderRadius: tokens.radius.md,
        overflow: tokens.layout.overflow.hidden,
        aspectRatio: 1,
      },
      thumb: {width: '100%', height: '100%'},
    });
