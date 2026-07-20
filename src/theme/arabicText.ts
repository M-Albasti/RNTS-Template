import type {TextStyle} from 'react-native';

import {arabicScriptFonts} from '@theme/fonts';
import type {ThemeTokens} from '@theme/types';

/**
 * Shared Arabic body text for Adhkar / Hadith / similar screens.
 * Explicit Amiri Naskh + fixed metrics so Android and iOS shape vocalized
 * Arabic the same (Cairo UI faces break joining on shadda/tanween).
 */
export const resolveArabicBodyTextStyle = (
  tokens: ThemeTokens,
  options?: {
    /** Defaults to mushaf body size (26). */
    fontSize?: number;
    /** Multiplier on fontSize when lineHeight is omitted. Default 1.7. */
    lineHeightRatio?: number;
    color?: string;
  },
): TextStyle => {
  const fontSize = options?.fontSize ?? tokens.typography.mushafBody.fontSize ?? 26;
  const lineHeight =
    options?.lineHeightRatio != null
      ? Math.round(fontSize * options.lineHeightRatio)
      : tokens.typography.mushafBody.lineHeight ?? Math.round(fontSize * 1.7);

  return {
    fontFamily: arabicScriptFonts.regular,
    fontWeight: 'normal',
    fontSize,
    lineHeight,
    color: options?.color ?? tokens.colors.mushafInk ?? tokens.colors.textPrimary,
    textAlign: 'right',
    writingDirection: 'rtl',
    includeFontPadding: false,
    textAlignVertical: 'center',
  };
};
