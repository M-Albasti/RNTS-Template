import type {ThemeTokens} from '@theme/types';

export const resolveThemeShowcaseStyles3 = (tokens: ThemeTokens) => ({
    flexRow: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
    flexBar: {
      flex: tokens.layout.flex.fill,
      height: tokens.sizes.iconSm,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.sm,
    },
    growBar: {
      ...tokens.layout.presets.grow,
      height: tokens.sizes.iconSm,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.sm,
    },
    presetCard: {padding: tokens.spacing.sm, gap: tokens.spacing.sm},
    clipHost: {
      width: tokens.sizes.videoPreviewLg / 3,
      height: tokens.sizes.iconSm,
      position: tokens.layout.position.relative,
    },
    clipFill: {
      ...tokens.layout.presets.clipOverlayTopLeft,
      width: tokens.sizes.showcaseRow,
      height: tokens.sizes.iconSm,
      backgroundColor: tokens.colors.ratingStar,
    },
    presetDemo: {gap: tokens.spacing.xs, marginTop: tokens.spacing.xs},
    presetBox: {
      width: tokens.sizes.iconSm,
      height: tokens.sizes.iconSm,
      borderRadius: tokens.radius.sm,
    },
    presetCardInner: {padding: tokens.spacing.sm},
  });
