import React, {useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import ScreenHeader from '@atoms/ScreenHeader';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveScreenContainerStyles} from './styles/resolveScreenContainerStyles';
import {spacing} from '@theme/tokens';

type SpacingKey = keyof typeof spacing;

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  centered?: boolean;
  safe?: boolean;
  /**
   * When scrolling, pin the first `ScreenHeader` (or `header` slot) above
   * the ScrollView so it stays sticky. Defaults to true.
   */
  stickyHeader?: boolean;
  /** Explicit sticky header — preferred when header is not the first child. */
  header?: React.ReactNode;
  /** Horizontal alignment of scroll/content area */
  alignContent?: 'center' | 'stretch';
  /** Extra bottom padding using spacing tokens */
  bottomPadding?: SpacingKey;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
}

const isScreenHeaderElement = (node: React.ReactNode): boolean => {
  if (!React.isValidElement(node)) {
    return false;
  }
  const type = node.type as {displayName?: string; name?: string};
  return (
    type === ScreenHeader ||
    type?.displayName === 'ScreenHeader' ||
    type?.name === 'ScreenHeader'
  );
};

const ScreenContainer = ({
  children,
  scroll = false,
  centered = false,
  safe = true,
  stickyHeader = true,
  header,
  alignContent = 'stretch',
  bottomPadding,
  style,
  contentStyle,
  scrollProps,
}: ScreenContainerProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(
    tokens => resolveScreenContainerStyles(tokens, alignContent, bottomPadding),
    [alignContent, bottomPadding],
  );

  const safeStyles = useMemo(
    () =>
      StyleSheet.create({
        safe: safe
          ? {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          : {},
      }),
    [insets.bottom, insets.left, insets.right, insets.top, safe],
  );

  const contentStyles = [
    styles.content,
    centered && styles.contentCentered,
    contentStyle,
  ];

  const childList = React.Children.toArray(children);
  const autoHeader =
    stickyHeader && !header && childList.length > 0 && isScreenHeaderElement(childList[0])
      ? childList[0]
      : null;
  const stickyNode = header ?? autoHeader;
  const bodyChildren = autoHeader ? childList.slice(1) : childList;

  if (scroll) {
    return (
      <View style={[styles.root, safeStyles.safe, style]}>
        {stickyNode ? (
          <View style={styles.stickyHeader}>{stickyNode}</View>
        ) : null}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            contentStyles,
            stickyNode ? styles.contentBelowSticky : null,
          ]}
          {...scrollProps}>
          {bodyChildren}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        safeStyles.safe,
        styles.content,
        centered && styles.contentCentered,
        contentStyle,
        style,
      ]}>
      {stickyNode}
      {bodyChildren}
    </View>
  );
};

export default ScreenContainer;
