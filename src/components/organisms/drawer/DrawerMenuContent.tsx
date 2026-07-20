import React, {useMemo} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import {isEmpty} from 'lodash';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';
import {logoutService} from '@services/authServices/logoutService';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveDrawerMenuContentStyles} from './styles/resolveDrawerMenuContentStyles';
import type {DrawerParamList} from '@Types/appNavigation';
import type {FontsFamily} from '@Types/fontsFamily';

type DrawerRoute = keyof DrawerParamList;

type MenuItem = {
  labelKey: string;
  route: DrawerRoute;
  icon: string;
  iconType?: FontsFamily;
};

const menuItems: MenuItem[] = [
  {labelKey: 'drawer.home', route: 'TabRoot', icon: 'home-outline'},
  {labelKey: 'drawer.profile', route: 'Profile', icon: 'person-outline'},
  {labelKey: 'drawer.socialFeed', route: 'PostStack', icon: 'newspaper-outline'},
  {labelKey: 'drawer.todoList', route: 'TodoStack', icon: 'checkbox-outline'},
  {labelKey: 'drawer.chat', route: 'ChatStack', icon: 'chatbubbles-outline'},
  {labelKey: 'drawer.luckySpinner', route: 'GameStack', icon: 'dice-outline'},
  {labelKey: 'drawer.wallet', route: 'WalletStack', icon: 'wallet-outline'},
  {labelKey: 'drawer.gallery', route: 'GalleryStack', icon: 'images-outline'},
  {labelKey: 'drawer.audios', route: 'AudioStack', icon: 'musical-notes-outline'},
  {labelKey: 'drawer.videos', route: 'VideoStack', icon: 'videocam-outline'},
  {labelKey: 'drawer.camera', route: 'CameraStack', icon: 'camera-outline'},
  {labelKey: 'drawer.delivery', route: 'DeliveryStack', icon: 'bicycle-outline'},
  {labelKey: 'drawer.marketplace', route: 'MarketplaceStack', icon: 'storefront-outline'},
  {labelKey: 'drawer.wordPuzzle', route: 'WordPuzzleStack', icon: 'grid-outline'},
  {labelKey: 'drawer.islamic', route: 'IslamicStack', icon: 'moon-outline'},
  {labelKey: 'drawer.designSystem', route: 'DesignSystemStack', icon: 'color-palette-outline'},
];

const DrawerMenuContent = (
  props: DrawerContentComponentProps,
): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveDrawerMenuContentStyles);

  const activeRoute = useMemo(() => {
    const route = props.state.routes[props.state.index];
    return (route?.name ?? 'TabRoot') as DrawerRoute;
  }, [props.state.index, props.state.routes]);

  const navigateTo = (route: DrawerRoute) => {
    props.navigation.navigate(route);
    props.navigation.closeDrawer();
  };

  const onLogout = () => {
    if (isEmpty(user)) {
      props.navigation.closeDrawer();
      return;
    }
    Alert.alert(t('drawer.logout'), t('drawer.logoutConfirm'), [
      {text: t('common.cancel', {defaultValue: 'Cancel'}), style: 'cancel'},
      {
        text: t('drawer.logout'),
        style: 'destructive',
        onPress: () => {
          props.navigation.closeDrawer();
          void logoutService(user.loginType, dispatch);
        },
      },
    ]);
  };

  const displayName =
    user?.displayName?.trim() || user?.email?.trim() || t('common.guest');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <TextView text={initial} variant="h3" />
        </View>
        <Heading text={t('drawer.menuTitle')} level="h3" />
        <Spacer size="xxs" />
        <TextView text={displayName} variant="bodySmall" muted numberOfLines={1} />
      </View>

      <View style={styles.menuSection}>
        {menuItems.map(item => {
          const active = activeRoute === item.route;
          return (
            <Pressable
              key={item.route}
              accessibilityRole="button"
              accessibilityState={{selected: active}}
              onPress={() => navigateTo(item.route)}
              style={({pressed}) => [
                styles.item,
                active && styles.itemActive,
                pressed && styles.itemPressed,
              ]}>
              <View style={[styles.itemIcon, active && styles.itemIconActive]}>
                <IconView
                  iconType={item.iconType ?? 'Ionicons'}
                  name={item.icon}
                  size={sizes.iconSm}
                  color={active ? colors.textInverse : colors.textPrimary}
                />
              </View>
              <TextView
                text={t(item.labelKey)}
                variant="body"
                style={[styles.itemLabel, active && styles.itemLabelActive]}
                numberOfLines={1}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            props.navigation.closeDrawer();
            rootNavigate('Settings', undefined);
          }}
          style={({pressed}) => [styles.item, pressed && styles.itemPressed]}>
          <View style={styles.itemIcon}>
            <IconView
              iconType="Ionicons"
              name="settings-outline"
              size={sizes.iconSm}
              color={colors.textPrimary}
            />
          </View>
          <TextView text={t('drawer.settings')} variant="body" style={styles.itemLabel} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onLogout}
          style={({pressed}) => [styles.item, pressed && styles.itemPressed]}>
          <View style={[styles.itemIcon, styles.logoutIcon]}>
            <IconView
              iconType="Ionicons"
              name="log-out-outline"
              size={sizes.iconSm}
              color={colors.error}
            />
          </View>
          <TextView
            text={t('drawer.logout')}
            variant="body"
            style={[styles.itemLabel, styles.logoutLabel]}
          />
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerMenuContent;
