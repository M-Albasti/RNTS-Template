import type {ThemeTokens} from '@theme/types';

export const resolveButtonsStyles = (tokens: ThemeTokens) => ({
      container: {
        flexDirection: tokens.layout.flexDirection.row,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
        backgroundColor: tokens.colors.overlay,
      },
      action: {
        flex: tokens.layout.flex.fill,
      },
    });
