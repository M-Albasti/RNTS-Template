//* packages import
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Divider from '@atoms/Divider';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {DrawerNavigationProp} from '@react-navigation/drawer';

import {useAppSelector} from '@hooks/useAppSelector';
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

interface ProfileProps {
  navigation: AppStackNavigationProp<'Profile'> &
    Partial<Pick<DrawerNavigationProp<DrawerParamList>, 'openDrawer'>>;
}

const Profile = ({navigation}: ProfileProps): React.JSX.Element => {
  const user = useAppSelector(state => state.auth.user);
  const posts = useAppSelector(state => state.posts.posts.length);
  const todos = useAppSelector(state => state.todos.items.filter(t => !t.done).length);
  const unread = useAppSelector(state => state.chat.threads.reduce((s, t) => s + t.unread, 0));
  const balance = useAppSelector(state => state.wallet.balance);
  const coins = useAppSelector(state => state.game.coins);
  const favorites = useAppSelector(state => state.gallery.images.filter(i => i.favorite).length);

  const drawerNav = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();

  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      avatar: {
        width: 72,
        height: 72,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.primaryMuted,
        ...tokens.layout.presets.selfCenter,
      },
      statsRow: {
        ...tokens.layout.presets.wrapRow,
        gap: tokens.spacing.sm,
      },
      stat: {
        flex: tokens.layout.flex.fill,
        minWidth: '46%' as const,
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.surfaceSecondary,
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.sm,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      actions: {gap: tokens.spacing.sm},
    }),
  );

  const openModule = (route: keyof DrawerParamList) => drawerNav?.navigate(route);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <Heading text="Profile" level="h1" />
      <Spacer size="lg" />

      <Card>
        <View style={styles.avatar} />
        <Spacer size="md" />
        <Heading
          text={user?.displayName || user?.email || 'Guest user'}
          level="h3"
          align="center"
        />
        {user?.loginType ? (
          <>
            <Spacer size="xs" />
            <TextView text={`Signed in via ${user.loginType}`} align="center" muted />
          </>
        ) : null}
      </Card>

      <Spacer size="lg" />
      <Heading text="Your activity" level="h3" />
      <Spacer size="sm" />
      <View style={styles.statsRow}>
        <Pressable style={styles.stat} onPress={() => openModule('PostStack')}>
          <TextView text={`${posts}`} variant="h3" align="center" />
          <TextView text="Posts" variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('TodoStack')}>
          <TextView text={`${todos}`} variant="h3" align="center" />
          <TextView text="Open todos" variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('ChatStack')}>
          <TextView text={`${unread}`} variant="h3" align="center" />
          <TextView text="Unread chats" variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('WalletStack')}>
          <TextView text={`$${balance.toFixed(0)}`} variant="h3" align="center" />
          <TextView text="Wallet" variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('GameStack')}>
          <TextView text={`${coins}`} variant="h3" align="center" />
          <TextView text="Game coins" variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('GalleryStack')}>
          <TextView text={`${favorites}`} variant="h3" align="center" />
          <TextView text="Favorites" variant="caption" muted align="center" />
        </Pressable>
      </View>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />
      <Heading text="Quick modules" level="h3" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="Social"
          subtitle="Feed & saved"
          iconType="Ionicons"
          iconName="newspaper-outline"
          onPress={() => openModule('PostStack')}
        />
        <FeatureHubCard
          title="Chat"
          subtitle="Messages"
          iconType="Ionicons"
          iconName="chatbubbles-outline"
          onPress={() => openModule('ChatStack')}
        />
        <FeatureHubCard
          title="Wallet"
          subtitle="Balance & cards"
          iconType="Ionicons"
          iconName="wallet-outline"
          onPress={() => openModule('WalletStack')}
        />
        <FeatureHubCard
          title="Gallery"
          subtitle="Photos"
          iconType="Ionicons"
          iconName="images-outline"
          onPress={() => openModule('GalleryStack')}
        />
      </View>

      <Spacer size="lg" />
      <View style={styles.actions}>
        <Button
          label="Open Settings"
          fullWidth
          onPress={() => rootNavigate('Settings', undefined)}
        />
        <Button
          label="Open Drawer"
          variant="secondary"
          fullWidth
          onPress={() => navigation.openDrawer?.()}
        />
      </View>
    </ScreenContainer>
  );
};

export default Profile;
