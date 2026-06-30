import type {ThemeTokens} from '@theme/types';

export const resolveChatSearchStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      hit: {gap: tokens.spacing.xs},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    });
