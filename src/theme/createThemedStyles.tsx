import {useMemo, type DependencyList} from 'react';
import {StyleSheet, ImageStyle, TextStyle, ViewStyle} from 'react-native';

import {useThemeTokens} from '@theme/useThemeTokens';
import type {ThemeTokens} from '@theme/types';

export type StyleRecord = Record<string, ViewStyle | TextStyle | ImageStyle>;

/** Style factory signature for external `resolve*Styles` modules. */
export type ResolveThemedStyles<
  T extends StyleRecord = StyleRecord,
  TArgs extends unknown[] = [],
> = (tokens: ThemeTokens, ...args: TArgs) => T;

/**
 * Builds a memoized StyleSheet from theme tokens.
 * Prefer importing a `resolve*Styles` function from a co-located `styles/` file.
 *
 * @example
 * const styles = useThemedStyles(resolveHomeScreenStyles);
 * const styles = useThemedStyles(
 *   tokens => resolveFeatureHubCardStyles(tokens, accentColor),
 *   [accentColor],
 * );
 */
export const useThemedStyles = <T extends StyleRecord = StyleRecord>(
  factory: (tokens: ThemeTokens) => Record<string, unknown>,
  deps: DependencyList = [],
): T => {
  const tokens = useThemeTokens();

  return useMemo(
    () => StyleSheet.create(factory(tokens) as T),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are forwarded intentionally
    [tokens, ...deps],
  );
};

/**
 * Non-hook version for static StyleSheet factories inside components that already have tokens.
 */
export const createThemedStyles = <T extends StyleRecord>(
  factory: (tokens: ThemeTokens) => Record<string, unknown>,
  tokens: ThemeTokens,
): T => StyleSheet.create(factory(tokens) as T);
