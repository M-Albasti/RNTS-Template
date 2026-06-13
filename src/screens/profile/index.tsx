//* packages import
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();
  const user = useAppSelector(state => state.auth.user);
  const posts = useAppSelector(state => state.posts.posts.length);
  const todos = useAppSelector(state => state.todos.items.filter(item => !item.done).length);
  const unread = useAppSelector(state => state.chat.threads.reduce((s, thread) => s + thread.unread, 0));
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
      <Heading text={t('profile.title')} level="h1" />
      <Spacer size="lg" />

      <Card>
        <View style={styles.avatar} />
        <Spacer size="md" />
        <Heading
          text={user?.displayName || user?.email || t('common.guestUser')}
          level="h3"
          align="center"
        />
        {user?.loginType ? (
          <>
            <Spacer size="xs" />
            <TextView text={t('auth.signedInVia', {type: user.loginType})} align="center" muted />
          </>
        ) : null}
      </Card>

      <Spacer size="lg" />
      <Heading text={t('profile.yourActivity')} level="h3" />
      <Spacer size="sm" />
      <View style={styles.statsRow}>
        <Pressable style={styles.stat} onPress={() => openModule('PostStack')}>
          <TextView text={`${posts}`} variant="h3" align="center" />
          <TextView text={t('profile.posts')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('TodoStack')}>
          <TextView text={`${todos}`} variant="h3" align="center" />
          <TextView text={t('profile.openTodos')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('ChatStack')}>
          <TextView text={`${unread}`} variant="h3" align="center" />
          <TextView text={t('profile.unreadChats')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('WalletStack')}>
          <TextView text={`$${balance.toFixed(0)}`} variant="h3" align="center" />
          <TextView text={t('profile.wallet')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('GameStack')}>
          <TextView text={`${coins}`} variant="h3" align="center" />
          <TextView text={t('profile.gameCoins')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('GalleryStack')}>
          <TextView text={`${favorites}`} variant="h3" align="center" />
          <TextView text={t('profile.favorites')} variant="caption" muted align="center" />
        </Pressable>
      </View>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />
      <Heading text={t('profile.quickModules')} level="h3" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('profile.social')}
          subtitle={t('profile.socialSubtitle')}
          iconType="Ionicons"
          iconName="newspaper-outline"
          onPress={() => openModule('PostStack')}
        />
        <FeatureHubCard
          title={t('chat.title')}
          subtitle={t('profile.chatSubtitle')}
          iconType="Ionicons"
          iconName="chatbubbles-outline"
          onPress={() => openModule('ChatStack')}
        />
        <FeatureHubCard
          title={t('profile.wallet')}
          subtitle={t('profile.walletSubtitle')}
          iconType="Ionicons"
          iconName="wallet-outline"
          onPress={() => openModule('WalletStack')}
        />
        <FeatureHubCard
          title={t('gallery.title')}
          subtitle={t('profile.gallerySubtitle')}
          iconType="Ionicons"
          iconName="images-outline"
          onPress={() => openModule('GalleryStack')}
        />
      </View>

      <Spacer size="lg" />
      <Card elevated={false}>
        <Heading text={t('home.quickActions')} level="h3" />
        <Spacer size="md" />
        <View style={styles.actions}>
          <Button
            label={t('profile.openSettings')}
            flat
            fullWidth
            onPress={() => rootNavigate('Settings', undefined)}
          />
          <Button
            label={t('profile.openDrawer')}
            variant="secondary"
            flat
            fullWidth
            onPress={() => navigation.openDrawer?.()}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
};

export default Profile;
