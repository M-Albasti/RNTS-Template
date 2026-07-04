import type {ThemeTokens} from '@theme/types';

export const resolveNewDeliveryStyles = (tokens: ThemeTokens) => ({
    section: {gap: tokens.spacing.sm},
    chipRow: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    chipActive: {
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.surfaceSecondary,
    },
  });
