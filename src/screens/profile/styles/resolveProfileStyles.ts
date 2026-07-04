import type {ThemeTokens} from '@theme/types';

export const resolveProfileStyles = (tokens: ThemeTokens) => ({
      avatar: {
        width: tokens.sizes.profileAvatar,
        height: tokens.sizes.profileAvatar,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.primaryMuted,
        ...tokens.layout.presets.selfCenter,
      },
      statsRow: {
        ...tokens.layout.presets.wrapRow,
        gap: tokens.spacing.sm,
      },
      stat: {
        flex: tokens.layout.flex.fill,
        minWidth: '46%' as const,
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.surfaceSecondary,
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.sm,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      actions: {gap: tokens.spacing.sm},
    });
