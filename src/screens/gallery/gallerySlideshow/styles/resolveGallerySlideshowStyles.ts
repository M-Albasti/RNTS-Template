import type {ThemeTokens} from '@theme/types';

export const resolveGallerySlideshowStyles = (tokens: ThemeTokens) => ({
      image: {
        width: '100%',
        height: tokens.sizes.gallerySlide,
        borderRadius: tokens.radius.lg,
      },
      controls: {...tokens.layout.presets.rowBetween},
    });
