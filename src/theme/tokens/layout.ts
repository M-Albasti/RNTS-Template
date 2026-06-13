import {StyleSheet} from 'react-native';

/**
 * Layout & flexbox tokens — use instead of raw strings/numbers in StyleSheet.
 * @example tokens.layout.presets.rowBetween
 * @example tokens.layout.justifyContent.center
 */
export const flex = {
  none: 0,
  fill: 1,
  half: 0.5,
  double: 2,
} as const;

export const flexGrow = {
  none: 0,
  fill: 1,
} as const;

export const flexShrink = {
  none: 0,
  fill: 1,
} as const;

export const borderWidth = {
  none: 0,
  hairline: StyleSheet.hairlineWidth,
  sm: 1,
  md: 2,
  lg: 3,
} as const;

export const justifyContent = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const;

export const alignItems = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

export const alignSelf = {
  auto: 'auto',
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

export const alignContent = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  between: 'space-between',
  around: 'space-around',
} as const;

export const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify',
} as const;

export const flexDirection = {
  row: 'row',
  column: 'column',
  rowReverse: 'row-reverse',
  columnReverse: 'column-reverse',
} as const;

export const flexWrap = {
  wrap: 'wrap',
  nowrap: 'nowrap',
  wrapReverse: 'wrap-reverse',
} as const;

export const position = {
  relative: 'relative',
  absolute: 'absolute',
} as const;

export const overflow = {
  visible: 'visible',
  hidden: 'hidden',
  scroll: 'scroll',
} as const;

/** Reusable layout combinations built from tokens above. */
export const presets = {
  fill: {flex: flex.fill},
  shrink: {flexShrink: flexShrink.fill},
  grow: {flexGrow: flexGrow.fill},
  row: {
    flexDirection: flexDirection.row,
    alignItems: alignItems.center,
  },
  rowStart: {
    flexDirection: flexDirection.row,
    alignItems: alignItems.start,
  },
  rowBetween: {
    flexDirection: flexDirection.row,
    alignItems: alignItems.center,
    justifyContent: justifyContent.between,
  },
  rowCenter: {
    flexDirection: flexDirection.row,
    alignItems: alignItems.center,
    justifyContent: justifyContent.center,
  },
  rowEnd: {
    flexDirection: flexDirection.row,
    alignItems: alignItems.center,
    justifyContent: justifyContent.end,
  },
  column: {
    flexDirection: flexDirection.column,
  },
  columnCenter: {
    flexDirection: flexDirection.column,
    alignItems: alignItems.center,
    justifyContent: justifyContent.center,
  },
  columnBetween: {
    flexDirection: flexDirection.column,
    justifyContent: justifyContent.between,
  },
  center: {
    justifyContent: justifyContent.center,
    alignItems: alignItems.center,
  },
  wrap: {
    flexWrap: flexWrap.wrap,
  },
  wrapRow: {
    flexDirection: flexDirection.row,
    flexWrap: flexWrap.wrap,
  },
  selfCenter: {
    alignSelf: alignSelf.center,
  },
  selfStretch: {
    alignSelf: alignSelf.stretch,
  },
  textCenter: {
    textAlign: textAlign.center,
  },
  textRight: {
    textAlign: textAlign.right,
  },
  absoluteFill: {
    position: position.absolute,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
} as const;

export type LayoutToken = {
  flex: typeof flex;
  flexGrow: typeof flexGrow;
  flexShrink: typeof flexShrink;
  borderWidth: typeof borderWidth;
  justifyContent: typeof justifyContent;
  alignItems: typeof alignItems;
  alignSelf: typeof alignSelf;
  alignContent: typeof alignContent;
  textAlign: typeof textAlign;
  flexDirection: typeof flexDirection;
  flexWrap: typeof flexWrap;
  position: typeof position;
  overflow: typeof overflow;
  presets: typeof presets;
};

export const layout: LayoutToken = {
  flex,
  flexGrow,
  flexShrink,
  borderWidth,
  justifyContent,
  alignItems,
  alignSelf,
  alignContent,
  textAlign,
  flexDirection,
  flexWrap,
  position,
  overflow,
  presets,
};
