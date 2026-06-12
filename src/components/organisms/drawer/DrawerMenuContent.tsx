import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Button from '@atoms/Button';
import Divider from '@atoms/Divider';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {DrawerParamList} from '@Types/appNavigation';

type DrawerRoute = keyof DrawerParamList;

const menuItems: {label: string; route: DrawerRoute}[] = [
  {label: 'Home', route: 'TabRoot'},
  {label: 'Profile', route: 'Profile'},
  {label: 'Audios', route: 'AudioStack'},
  {label: 'Videos', route: 'VideoStack'},
];

const DrawerMenuContent = (
  props: DrawerContentComponentProps,
): React.JSX.Element => {
  const user = useAppSelector(state => state.auth.user);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: tokens.spacing.xxl,
        paddingHorizontal: tokens.spacing.lg,
        backgroundColor: tokens.colors.background,
      },
      footer: {
        marginTop: 'auto' as const,
        paddingBottom: tokens.spacing.xl,
        gap: tokens.spacing.sm,
      },
    }),
  );

  const navigateTo = (route: DrawerRoute) => {
    props.navigation.navigate(route);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <Heading text="RNTS Menu" level="h2" />
      <Spacer size="xs" />
      <TextView
        text={user?.email || 'Guest'}
        variant="bodySmall"
        muted
      />
      <Spacer size="lg" />
      <Divider spacing="sm" />

      {menuItems.map(item => (
        <View key={item.route}>
          <Spacer size="sm" />
          <Button
            label={item.label}
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
          label="Settings"
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
