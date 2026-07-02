import type {ThemeTokens} from '@theme/types';

export const resolveButtonsStyles = (tokens: ThemeTokens) => ({
    container: {
      ...tokens.layout.presets.rowCenter,
    },
    recordTouchableContainer: {
      alignSelf: tokens.layout.alignSelf.center,
      ...tokens.layout.presets.rowCenter,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderRadius: tokens.radius.lg,
      marginVertical: tokens.spacing.md,
    },
    recordTextContainer: {
      paddingHorizontal: tokens.spacing.xs,
    },
    recordText: {
      ...tokens.layout.presets.textRight,
      ...tokens.typography.title,
    },
  });
