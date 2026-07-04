import type {ThemeTokens} from '@theme/types';

export const resolveTodoFocusStyles = (tokens: ThemeTokens) => ({
      timer: {...tokens.layout.presets.center, padding: tokens.spacing.xxl},
      time: {...tokens.typography.h1, ...tokens.layout.presets.textCenter},
      actions: {gap: tokens.spacing.sm},
    });
