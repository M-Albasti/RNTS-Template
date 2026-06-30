import type {ThemeTokens} from '@theme/types';

export const resolveNewChatStyles = (tokens: ThemeTokens) => ({
      row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      avatar: {width: 44, height: 44, borderRadius: tokens.radius.full},
      meta: {flex: tokens.layout.flex.fill},
      dot: {
        width: 10,
        height: 10,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.success,
      },
      offline: {backgroundColor: tokens.colors.textMuted},
    });
