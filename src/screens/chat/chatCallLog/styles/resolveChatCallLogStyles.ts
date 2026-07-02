import type {ThemeTokens} from '@theme/types';

export const resolveChatCallLogStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.rowBetween},
      missed: {color: tokens.colors.error},
    });
