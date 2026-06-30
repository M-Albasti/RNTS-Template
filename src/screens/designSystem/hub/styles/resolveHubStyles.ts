import type {ThemeTokens} from '@theme/types';

export const resolveHubStyles = (tokens: ThemeTokens) => ({
    category: {gap: tokens.spacing.sm},
    item: {
      ...tokens.layout.presets.rowBetween,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.radius.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
    },
    itemPressed: {backgroundColor: tokens.colors.surfaceSecondary},
  });
