import {useMemo} from 'react';
import {StyleSheet, TextStyle, ViewStyle} from 'react-native';

import {useThemeTokens} from '@theme/useThemeTokens';
import type {ThemeTokens} from '@theme/types';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle;
};

/**
 * Builds a memoized StyleSheet from theme tokens.
 * Keeps screen styles co-located while staying reactive to dark/light mode.
 *
 * @example
 * const styles = useThemedStyles(tokens => ({
 *   container: { flex: tokens.layout.flex.fill, backgroundColor: tokens.colors.background },
 * }));
 */
export const useThemedStyles = <T extends NamedStyles<T>>(
  factory: (tokens: ThemeTokens) => T,
): T => {
  const tokens = useThemeTokens();

  return useMemo(() => StyleSheet.create(factory(tokens)), [tokens]);
};

/**
 * Non-hook version for static StyleSheet factories inside components that already have tokens.
 */
export const createThemedStyles = <T extends NamedStyles<T>>(
  factory: (tokens: ThemeTokens) => T,
  tokens: ThemeTokens,
): T => StyleSheet.create(factory(tokens));
