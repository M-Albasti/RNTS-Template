import type {ThemeTokens} from '@theme/types';

export const resolveGallerySearchStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    });
