import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Divider from '@atoms/Divider';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDrawerMenuContentStyles} from './styles/resolveDrawerMenuContentStyles';
import type {DrawerParamList} from '@Types/appNavigation';

type DrawerRoute = keyof DrawerParamList;

const menuItems: {labelKey: string; route: DrawerRoute}[] = [
  {labelKey: 'drawer.home', route: 'TabRoot'},
  {labelKey: 'drawer.profile', route: 'Profile'},
  {labelKey: 'drawer.socialFeed', route: 'PostStack'},
  {labelKey: 'drawer.todoList', route: 'TodoStack'},
  {labelKey: 'drawer.chat', route: 'ChatStack'},
  {labelKey: 'drawer.luckySpinner', route: 'GameStack'},
  {labelKey: 'drawer.wallet', route: 'WalletStack'},
  {labelKey: 'drawer.gallery', route: 'GalleryStack'},
  {labelKey: 'drawer.audios', route: 'AudioStack'},
  {labelKey: 'drawer.videos', route: 'VideoStack'},
  {labelKey: 'drawer.camera', route: 'CameraStack'},
  {labelKey: 'drawer.delivery', route: 'DeliveryStack'},
  {labelKey: 'drawer.marketplace', route: 'MarketplaceStack'},
  {labelKey: 'drawer.designSystem', route: 'DesignSystemStack'},
];

const DrawerMenuContent = (
  props: DrawerContentComponentProps,
): React.JSX.Element => {
  const {t} = useTranslation();
  const user = useAppSelector(state => state.auth.user);
  const styles = useThemedStyles(resolveDrawerMenuContentStyles);

  const navigateTo = (route: DrawerRoute) => {
    props.navigation.navigate(route);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <Heading text={t('drawer.menuTitle')} level="h2" />
      <Spacer size="xs" />
      <TextView text={user?.email || t('common.guest')} variant="bodySmall" muted />
      <Spacer size="lg" />
      <Divider spacing="sm" />

      {menuItems.map(item => (
        <View key={item.route}>
          <Spacer size="sm" />
          <Button
            label={t(item.labelKey)}
            variant="ghost"
            fullWidth
            onPress={() => navigateTo(item.route)}
          />
        </View>
      ))}

      <View style={styles.footer}>
        <Divider spacing="sm" />
        <Spacer size="sm" />
        <Button
          label={t('drawer.settings')}
          variant="secondary"
          fullWidth
          onPress={() => {
            props.navigation.closeDrawer();
            rootNavigate('Settings', undefined);
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerMenuContent;
