import {Platform} from 'react-native';

import type {ThemeTokens} from '@theme/types';

/**
 * Focusify filled field: soft neutral wash, XL radius, icon slots.
 * TextInput avoids `lineHeight` — it clips Cairo/Android glyphs at the top.
 */
export const resolveTextInputViewStyles = (tokens: ThemeTokens) => ({
  wrap: {
    width: '100%' as const,
    gap: tokens.spacing.sm,
  },
  label: {
    ...tokens.typography.bodySmall,
    color: tokens.colors.textPrimary,
    fontWeight: '600' as const,
    paddingTop: 2,
  },
  field: {
    ...tokens.layout.presets.row,
    alignItems: 'center' as const,
    gap: tokens.spacing.sm,
    minHeight: 56,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.xl,
    backgroundColor: `${tokens.colors.textPrimary}0F`,
    borderWidth: 1.5,
    borderColor: tokens.colors.transparent,
  },
  fieldFocused: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.surface,
  },
  fieldError: {
    borderColor: tokens.colors.error,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch' as const,
    fontSize: tokens.typography.input.fontSize,
    fontFamily: tokens.typography.input.fontFamily,
    color: tokens.colors.textPrimary,
    // No lineHeight — clips Cairo at the top on Android.
    // Zero vertical padding + stretch height centers via textAlignVertical.
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
    margin: 0,
    textAlignVertical: 'center' as const,
    includeFontPadding: false,
  },
  inputMultiline: {
    textAlignVertical: 'top' as const,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
  iconSlot: {
    ...tokens.layout.presets.center,
    width: 28,
    height: 28,
  },
});
