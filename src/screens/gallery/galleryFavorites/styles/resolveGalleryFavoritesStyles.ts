import type {ThemeTokens} from '@theme/types';

export const resolveGalleryFavoritesStyles = (tokens: ThemeTokens) => ({
      tile: {
        flex: tokens.layout.flex.fill,
        margin: tokens.spacing.xs,
        borderRadius: tokens.radius.md,
        overflow: tokens.layout.overflow.hidden,
        aspectRatio: 1,
      },
      image: {width: '100%', height: '100%'},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    });
