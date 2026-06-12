import React, {useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useThemedStyles} from '@theme/createThemedStyles';
import {spacing} from '@theme/tokens';

type SpacingKey = keyof typeof spacing;

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  centered?: boolean;
  safe?: boolean;
  /** Horizontal alignment of scroll/content area */
  alignContent?: 'center' | 'stretch';
  /** Extra bottom padding using spacing tokens */
  bottomPadding?: SpacingKey;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
}

const ScreenContainer = ({
  children,
  scroll = false,
  centered = false,
  safe = true,
  alignContent = 'stretch',
  bottomPadding,
  style,
  contentStyle,
  scrollProps,
}: ScreenContainerProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(tokens => ({
    root: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    content: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.lg,
      alignItems: alignContent === 'center' ? ('center' as const) : ('stretch' as const),
      paddingBottom: bottomPadding
        ? tokens.spacing[bottomPadding]
        : tokens.spacing.lg,
    },
    contentCentered: {
      flexGrow: 1,
      justifyContent: 'center' as const,
    },
  }));

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

  if (scroll) {
    return (
      <View style={[styles.root, safeStyles.safe, style]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentStyles}
          {...scrollProps}>
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, safeStyles.safe, styles.content, centered && styles.contentCentered, contentStyle, style]}>
      {children}
    </View>
  );
};

export default ScreenContainer;
