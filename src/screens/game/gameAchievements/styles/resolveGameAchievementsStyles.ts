import type {ThemeTokens} from '@theme/types';

export const resolveGameAchievementsStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.rowBetween},
      locked: {opacity: 0.5},
    });
