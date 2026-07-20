import type {ThemeTokens} from '@theme/types';

/** Floating pill tab bar — detached from screen edges (Android). */
export const FLOATING_TAB_BAR_HEIGHT = 64;
export const FLOATING_TAB_BAR_SIDE_INSET = 16;
export const FLOATING_TAB_BAR_BOTTOM_GAP = 10;

/** Extra scroll padding so last content can clear the floating pill. */
export const FLOATING_TAB_CONTENT_INSET =
  FLOATING_TAB_BAR_HEIGHT + FLOATING_TAB_BAR_BOTTOM_GAP + 24;

export const resolveFloatingTabBarStyles = (tokens: ThemeTokens) => ({
  /** Full-bleed host — must stay fully transparent. */
  host: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
  },
  pill: {
    marginHorizontal: FLOATING_TAB_BAR_SIDE_INSET,
    borderRadius: tokens.radius.full,
    overflow: 'hidden' as const,
    borderWidth: tokens.layout.borderWidth.sm,
    borderColor: `${tokens.colors.primary}55`,
    backgroundColor: `${tokens.colors.surface}F2`,
    ...tokens.shadows.md,
  },
  row: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    justifyContent: 'space-around' as const,
    height: FLOATING_TAB_BAR_HEIGHT,
    paddingHorizontal: tokens.spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 2,
    paddingVertical: tokens.spacing.xs,
    overflow: 'hidden' as const,
  },
  /** Soft pill — tall enough that the home roof never peeks as a triangle. */
  iconWrap: {
    minWidth: 56,
    height: 34,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.full,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
  iconWrapActive: {
    backgroundColor: tokens.colors.primaryMuted,
  },
  label: {
    ...tokens.typography.caption,
    fontWeight: '600' as const,
  },
});
