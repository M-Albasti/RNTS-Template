import type {ThemeTokens} from '@theme/types';

export const resolvePostSearchStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    });
