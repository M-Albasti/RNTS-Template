import type {ThemeTokens} from '@theme/types';

export const resolveChatRoomStyles = (tokens: ThemeTokens) => ({
      list: {flex: tokens.layout.flex.fill},
      bubbleMe: {
        alignSelf: tokens.layout.alignSelf.end,
        backgroundColor: tokens.colors.primaryMuted,
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.md,
        maxWidth: '80%',
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      bubbleOther: {
        alignSelf: tokens.layout.alignSelf.start,
        backgroundColor: tokens.colors.surfaceSecondary,
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.md,
        maxWidth: '80%',
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      inputRow: {
        ...tokens.layout.presets.row,
        alignItems: tokens.layout.alignItems.end,
        gap: tokens.spacing.sm,
      },
      input: {flex: tokens.layout.flex.fill},
      headerActions: {...tokens.layout.presets.rowEnd, gap: tokens.spacing.sm},
    });
