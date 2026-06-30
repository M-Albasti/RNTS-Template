import type {ThemeTokens} from '@theme/types';

export const resolveCreatePostStyles = (tokens: ThemeTokens) => ({
      types: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      typeChip: {
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        borderRadius: tokens.radius.md,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      typeChipActive: {
        backgroundColor: tokens.colors.primaryMuted,
        borderColor: tokens.colors.primary,
      },
    });
