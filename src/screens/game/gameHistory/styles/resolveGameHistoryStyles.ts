import type {ThemeTokens} from '@theme/types';

export const resolveGameHistoryStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.rowBetween},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
      gain: {color: tokens.colors.success},
      loss: {color: tokens.colors.error},
    });
