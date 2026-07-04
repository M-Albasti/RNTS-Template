import type {ThemeTokens} from '@theme/types';

export const resolveSettingsStyles = (tokens: ThemeTokens) => ({
    row: {
      ...tokens.layout.presets.rowBetween,
    },
    modeRow: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.sm,
    },
    modeButton: {
      flex: tokens.layout.flex.fill,
      minWidth: '30%' as const,
    },
  });
