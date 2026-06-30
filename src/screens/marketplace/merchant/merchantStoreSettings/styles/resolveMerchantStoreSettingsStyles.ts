import type {ThemeTokens} from '@theme/types';

export const resolveMerchantStoreSettingsStyles = (tokens: ThemeTokens) => ({
    row: {...tokens.layout.presets.rowBetween, alignItems: tokens.layout.alignItems.center},
    settingsCard: {gap: tokens.spacing.md, marginBottom: tokens.spacing.md},
  });
