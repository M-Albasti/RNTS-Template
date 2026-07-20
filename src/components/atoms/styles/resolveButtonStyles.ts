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
        borderRadius: tokens.radius.full,
        minHeight: 40,
      },
      sizeMd: {
        paddingVertical: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.lg,
        borderRadius: tokens.radius.full,
        minHeight: 54,
      },
      sizeLg: {
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.xl,
        borderRadius: tokens.radius.full,
        minHeight: 58,
      },
      primary: {backgroundColor: tokens.colors.primary},
      primaryPressed: {opacity: 0.9, backgroundColor: tokens.colors.primary},
      secondary: {
        backgroundColor: tokens.colors.primaryMuted,
        borderWidth: 0,
      },
      secondaryPressed: {opacity: 0.9, backgroundColor: tokens.colors.primaryMuted},
      outline: {
        backgroundColor: tokens.colors.surface,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      outlinePressed: {backgroundColor: tokens.colors.surfaceSecondary},
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
        color: tokens.colors.primary,
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
