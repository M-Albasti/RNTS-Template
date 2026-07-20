import React, {useMemo} from 'react';
import {View} from 'react-native';
import {
  DrawerActions,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';

import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {FontsFamily} from '@Types/fontsFamily';
import {resolveScreenHeaderStyles} from './styles/resolveScreenHeaderStyles';

export type AppHeaderAction = {
  key: string;
  iconName: string;
  iconType?: FontsFamily;
  onPress: () => void;
  accessibilityLabel?: string;
  color?: string;
  disabled?: boolean;
};

type HeaderNavigation = Pick<
  NavigationProp<ParamListBase>,
  'goBack' | 'canGoBack' | 'dispatch'
>;

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /**
   * Show back button. Defaults to `true` when `onBack` is set, or when
   * `navigation` can go back and `showDrawer` is not the leading control.
   */
  showBack?: boolean;
  onBack?: () => void;
  /** Show drawer/menu leading button (hubs / tab roots). */
  showDrawer?: boolean;
  onDrawerPress?: () => void;
  /** Optional navigation — enables auto back / drawer when handlers omitted. */
  navigation?: HeaderNavigation;
  /** Extra leading icons (after drawer/back). */
  leftActions?: AppHeaderAction[];
  /** Trailing action icons (preferred for multiple icons). */
  rightActions?: AppHeaderAction[];
  /** Legacy single trailing slot — rendered after `rightActions`. */
  rightAccessory?: React.ReactNode;
  titleAlign?: 'center' | 'left';
};

const renderActions = (
  actions: AppHeaderAction[] | undefined,
  size: number,
  defaultColor: string,
  btnStyle: object,
) =>
  (actions ?? []).map(action => (
    <TouchableIcon
      key={action.key}
      iconType={action.iconType ?? 'Ionicons'}
      name={action.iconName}
      size={size}
      color={action.color ?? defaultColor}
      onPress={action.onPress}
      disabled={action.disabled}
      accessibilityLabel={action.accessibilityLabel ?? action.key}
      style={btnStyle}
    />
  ));

/**
 * Dynamic app header: drawer, back, title, and any number of action icons.
 */
const ScreenHeader = ({
  title,
  subtitle,
  showBack,
  onBack,
  showDrawer = false,
  onDrawerPress,
  navigation,
  leftActions,
  rightActions,
  rightAccessory,
  titleAlign = 'center',
}: ScreenHeaderProps): React.JSX.Element => {
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveScreenHeaderStyles);

  const resolveBack = useMemo(() => {
    if (onBack) {
      return onBack;
    }
    if (navigation?.canGoBack?.()) {
      return () => navigation.goBack();
    }
    return undefined;
  }, [navigation, onBack]);

  const resolveDrawer = useMemo(() => {
    if (onDrawerPress) {
      return onDrawerPress;
    }
    if (navigation) {
      return () => navigation.dispatch(DrawerActions.openDrawer());
    }
    return undefined;
  }, [navigation, onDrawerPress]);

  const shouldShowBack =
    showBack ?? Boolean(resolveBack && !showDrawer);
  const shouldShowDrawer = showDrawer && Boolean(resolveDrawer);

  const hasLeft =
    shouldShowDrawer || shouldShowBack || (leftActions?.length ?? 0) > 0;
  const hasRight =
    (rightActions?.length ?? 0) > 0 || Boolean(rightAccessory);

  return (
    <View style={styles.root}>
      <View style={styles.row}>
      <View style={[styles.side, styles.sideStart]}>
        {shouldShowDrawer && resolveDrawer ? (
          <TouchableIcon
            iconType="Ionicons"
            name="menu-outline"
            size={sizes.iconSm}
            color={colors.textPrimary}
            onPress={resolveDrawer}
            accessibilityLabel="Open menu"
            style={styles.iconBtn}
          />
        ) : null}
        {shouldShowBack && resolveBack ? (
          <TouchableIcon
            iconType="Ionicons"
            name="chevron-back"
            size={sizes.iconSm}
            color={colors.textPrimary}
            onPress={resolveBack}
            accessibilityLabel="Go back"
            style={styles.iconBtn}
          />
        ) : null}
        {renderActions(
          leftActions,
          sizes.iconSm,
          colors.textPrimary,
          styles.iconBtn,
        )}
        {!hasLeft ? <View style={styles.iconBtn} /> : null}
      </View>

      <View
        style={[
          styles.titleWrap,
          titleAlign === 'left' && styles.titleWrapStart,
        ]}>
        <Heading
          text={title}
          level="h3"
          align={titleAlign === 'left' ? 'left' : 'center'}
        />
        {subtitle ? (
          <TextView
            text={subtitle}
            variant="caption"
            muted
            align={titleAlign === 'left' ? 'left' : 'center'}
            style={styles.subtitle}
          />
        ) : null}
      </View>

      <View style={[styles.side, styles.sideEnd]}>
        {renderActions(
          rightActions,
          sizes.iconSm,
          colors.textPrimary,
          styles.iconBtn,
        )}
        {rightAccessory}
        {!hasRight ? <View style={styles.iconBtn} /> : null}
      </View>
      </View>
    </View>
  );
};

ScreenHeader.displayName = 'ScreenHeader';

export default ScreenHeader;
