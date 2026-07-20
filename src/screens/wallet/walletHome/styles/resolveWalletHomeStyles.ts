import type {ThemeTokens} from '@theme/types';

/** Payza-inspired wallet: balance card + quick action grid. */
export const resolveWalletHomeStyles = (tokens: ThemeTokens) => ({
  hero: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    gap: tokens.spacing.xs,
    ...tokens.shadows.md,
  },
  heroText: {color: tokens.colors.textInverse},
  heroMuted: {color: tokens.colors.textInverse, opacity: 0.85},
  quickRow: {
    ...tokens.layout.presets.row,
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  quickAction: {
    flex: tokens.layout.flex.fill,
    alignItems: 'center' as const,
    gap: tokens.spacing.xs,
    backgroundColor: tokens.colors.cameraControlSurface,
    borderRadius: tokens.radius.lg,
    paddingVertical: tokens.spacing.md,
  },
  grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
});
