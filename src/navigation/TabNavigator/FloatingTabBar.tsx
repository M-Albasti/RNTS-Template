import React, {useContext} from 'react';
import {LayoutChangeEvent, Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {BottomTabBarHeightCallbackContext} from '@react-navigation/bottom-tabs';

import IconView from '@atoms/Icon';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  resolveFloatingTabBarStyles,
} from './styles/resolveFloatingTabBarStyles';

const ROUTE_ICONS: Record<string, string> = {
  Home: 'home',
  ServicesHub: 'grid',
  Profile: 'person',
};

/**
 * True floating pill over content — transparent host, no reserved strip.
 * Reports height 0 so React Navigation does not pad a solid band under scenes.
 */
const FloatingTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveFloatingTabBarStyles);
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const bottomPad = Math.max(insets.bottom, FLOATING_TAB_BAR_BOTTOM_GAP);

  const onHostLayout = (_event: LayoutChangeEvent) => {
    // Absolute float: do not reserve layout space (that creates the opaque strip).
    onHeightChange?.(0);
  };

  return (
    <View
      style={[styles.host, {paddingBottom: bottomPad}]}
      pointerEvents="box-none"
      onLayout={onHostLayout}>
      <View style={styles.pill}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const focused = state.index === index;
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : typeof options.title === 'string'
                  ? options.title
                  : route.name;
            const tint = focused ? colors.primary : colors.textMuted;
            const iconName = ROUTE_ICONS[route.name] ?? 'ellipse';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={onPress}
                onLongPress={() =>
                  navigation.emit({type: 'tabLongPress', target: route.key})
                }
                android_ripple={{color: colors.primaryMuted, borderless: true}}
                style={styles.item}>
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <IconView
                    iconType="Ionicons"
                    name={focused ? iconName : `${iconName}-outline`}
                    size={20}
                    color={tint}
                  />
                </View>
                <Text style={[styles.label, {color: tint}]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default FloatingTabBar;
