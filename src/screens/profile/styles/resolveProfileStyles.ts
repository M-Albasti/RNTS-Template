import type {ThemeTokens} from '@theme/types';

export const resolveProfileStyles = (tokens: ThemeTokens) => {
  const avatarSize = tokens.sizes.profileAvatar;
  const avatarOverlap = avatarSize / 2;
  const coverHeight = 132;

  return {
    // Extra bottom space so the overlapping avatar is never clipped by ScrollView.
    headerBlock: {
      marginBottom: tokens.spacing.md,
      paddingBottom: avatarOverlap + tokens.spacing.sm,
      overflow: 'visible' as const,
    },
    cover: {
      height: coverHeight,
      borderRadius: tokens.radius.xl,
      backgroundColor: tokens.colors.primary,
      overflow: 'hidden' as const,
    },
    coverGlow: {
      position: 'absolute' as const,
      top: -24,
      right: -16,
      width: 140,
      height: 140,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.accent1,
      opacity: 0.3,
    },
    coverGlowSecondary: {
      position: 'absolute' as const,
      bottom: -32,
      left: -24,
      width: 120,
      height: 120,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.accent2,
      opacity: 0.24,
    },
    avatarRow: {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      top: coverHeight - avatarOverlap,
      alignItems: 'center' as const,
      zIndex: 4,
      elevation: 4,
    },
    avatarRing: {
      width: avatarSize + 8,
      height: avatarSize + 8,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.background,
      borderWidth: 3,
      borderColor: tokens.colors.background,
      ...tokens.layout.presets.center,
      ...tokens.shadows.md,
      overflow: 'visible' as const,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primaryMuted,
      overflow: 'hidden' as const,
      ...tokens.layout.presets.center,
    },
    avatarImage: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: tokens.radius.full,
    },
    identity: {
      alignItems: 'center' as const,
      marginTop: tokens.spacing.xs,
      marginBottom: tokens.spacing.lg,
    },
    statsRow: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      marginBottom: tokens.spacing.lg,
    },
    stat: {
      flex: tokens.layout.flex.fill,
      ...tokens.layout.presets.columnCenter,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.xs,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    actions: {gap: tokens.spacing.sm},
    sectionGap: {marginTop: tokens.spacing.sm},
    menuList: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      overflow: 'hidden' as const,
    },
    menuRow: {
      ...tokens.layout.presets.row,
      alignItems: 'center' as const,
      gap: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    menuRowLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: tokens.sizes.touchTarget,
      height: tokens.sizes.touchTarget,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primaryMuted,
      ...tokens.layout.presets.center,
    },
    menuCopy: {
      flex: tokens.layout.flex.fill,
      gap: 2,
    },
  };
};
