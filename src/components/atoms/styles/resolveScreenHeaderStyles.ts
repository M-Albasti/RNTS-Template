import type {ThemeTokens} from '@theme/types';

export const resolveScreenHeaderStyles = (tokens: ThemeTokens) => ({
  /** Sticky shell — opaque so content does not show through while scrolling. */
  root: {
    backgroundColor: tokens.colors.background,
    paddingBottom: tokens.spacing.sm,
    borderBottomWidth: tokens.layout.borderWidth.sm,
    borderBottomColor: tokens.colors.border,
  },
  row: {
    ...tokens.layout.presets.rowBetween,
    alignItems: 'center' as const,
    minHeight: tokens.sizes.touchTarget,
    gap: tokens.spacing.xs,
  },
  side: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    minWidth: tokens.sizes.touchTarget,
    gap: tokens.spacing.xxs,
  },
  sideEnd: {
    justifyContent: 'flex-end' as const,
  },
  sideStart: {
    justifyContent: 'flex-start' as const,
  },
  iconBtn: {
    width: tokens.sizes.touchTarget,
    height: tokens.sizes.touchTarget,
    ...tokens.layout.presets.center,
    borderRadius: tokens.radius.full,
  },
  titleWrap: {
    flex: tokens.layout.flex.fill,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: tokens.spacing.xs,
    minWidth: 0,
  },
  titleWrapStart: {
    alignItems: 'flex-start' as const,
  },
  subtitle: {
    marginTop: 2,
  },
});
