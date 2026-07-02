import type {ThemeTokens} from '@theme/types';

export const resolveButtonStyles = (tokens: ThemeTokens) => ({
      base: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
      },
      shadowSm: {
        ...tokens.shadows.sm,
      },
      shadowNone: {
        ...tokens.shadows.none,
      },
      fullWidth: {
        alignSelf: 'stretch',
        width: '100%',
      },
      disabled: {
        opacity: 0.5,
      },
      sizeSm: {
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        borderRadius: tokens.radius.md,
      },
      sizeMd: {
        paddingVertical: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.lg,
        borderRadius: tokens.radius.md,
      },
      sizeLg: {
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.xl,
        borderRadius: tokens.radius.lg,
      },
      primary: {backgroundColor: tokens.colors.primary},
      primaryPressed: {backgroundColor: tokens.colors.primaryContrast},
      secondary: {
        backgroundColor: tokens.colors.surface,
        borderWidth: 1,
        borderColor: tokens.colors.border,
      },
      secondaryPressed: {backgroundColor: tokens.colors.surfaceSecondary},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: tokens.colors.primary,
      },
      outlinePressed: {backgroundColor: tokens.colors.primaryMuted},
      ghost: {backgroundColor: 'transparent'},
      ghostPressed: {backgroundColor: tokens.colors.surfaceSecondary},
      danger: {backgroundColor: tokens.colors.error},
      dangerPressed: {backgroundColor: tokens.colors.errorMuted},
      labelPrimary: {
        ...tokens.typography.button,
        textAlign: 'center',
        color: tokens.colors.textInverse,
      },
      labelSecondary: {
        ...tokens.typography.button,
        textAlign: 'center',
        color: tokens.colors.textPrimary,
      },
      labelAccent: {
        ...tokens.typography.button,
        textAlign: 'center',
        color: tokens.colors.primary,
      },
      labelDanger: {
        ...tokens.typography.button,
        textAlign: 'center',
        color: tokens.colors.textInverse,
      },
    });
