//* packages import
import React from 'react';
import {Image, ImageStyle, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import SectionHeader from '@molecules/SectionHeader';

import {DrawerNavigationProp} from '@react-navigation/drawer';

import {useAppSelector} from '@hooks/useAppSelector';
import {FLOATING_TAB_CONTENT_INSET} from '@navigation/TabNavigator/styles/resolveFloatingTabBarStyles';
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveProfileStyles} from './styles/resolveProfileStyles';
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

interface ProfileProps {
  navigation: AppStackNavigationProp<'Profile'> &
    Partial<Pick<DrawerNavigationProp<DrawerParamList>, 'openDrawer'>>;
}

const Profile = ({navigation}: ProfileProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, sizes} = useThemeTokens();
  const user = useAppSelector(state => state.auth.user);
  const posts = useAppSelector(state => state.posts.posts.length);
  const todos = useAppSelector(state =>
    state.todos.items.filter(item => !item.done).length,
  );
  const unread = useAppSelector(state =>
    state.chat.threads.reduce((sum, thread) => sum + thread.unread, 0),
  );
  const balance = useAppSelector(state => state.wallet.balance);
  const coins = useAppSelector(state => state.game.coins);
  const favorites = useAppSelector(
    state => state.gallery.images.filter(item => item.favorite).length,
  );

  const drawerNav = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();
  const styles = useThemedStyles(resolveProfileStyles);
  const openModule = (route: keyof DrawerParamList) => drawerNav?.navigate(route);

  const displayName =
    user?.displayName?.trim() || user?.email?.split('@')[0] || t('common.guestUser');
  const handle = user?.email ? `@${user.email.split('@')[0]}` : t('common.guest');
  const avatarUri = user?.photoURL || undefined;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <ScreenContainer
      scroll
      bottomPadding="xxl"
      contentStyle={{overflow: 'visible', paddingBottom: FLOATING_TAB_CONTENT_INSET}}>
      <ScreenHeader
        title={t('profile.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'settings',
            iconName: 'settings-outline',
            onPress: () => rootNavigate('Settings', undefined),
            accessibilityLabel: t('home.settings'),
          },
        ]}
      />
      <View style={styles.headerBlock}>
        <View style={styles.cover}>
          <View style={styles.coverGlow} />
          <View style={styles.coverGlowSecondary} />
        </View>
        <View style={styles.avatarRow}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              {avatarUri ? (
                <Image
                  source={{uri: avatarUri}}
                  style={styles.avatarImage as ImageStyle}
                  resizeMode="cover"
                />
              ) : (
                <TextView text={initial} variant="h3" />
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.identity}>
        <Heading text={displayName} level="h2" align="center" />
        <Spacer size="xxs" />
        <TextView text={handle} variant="bodySmall" muted align="center" />
        {user?.loginType ? (
          <>
            <Spacer size="xs" />
            <TextView
              text={t('auth.signedInVia', {type: user.loginType})}
              variant="caption"
              muted
              align="center"
            />
          </>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <Pressable style={styles.stat} onPress={() => openModule('PostStack')}>
          <TextView text={`${posts}`} variant="h3" align="center" />
          <TextView text={t('profile.posts')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('ChatStack')}>
          <TextView text={`${unread}`} variant="h3" align="center" />
          <TextView text={t('profile.unreadChats')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('WalletStack')}>
          <TextView text={`$${balance.toFixed(0)}`} variant="h3" align="center" />
          <TextView text={t('profile.wallet')} variant="caption" muted align="center" />
        </Pressable>
      </View>

      <SectionHeader title={t('profile.yourActivity')} />
      <Spacer size="sm" />
      <View style={styles.statsRow}>
        <Pressable style={styles.stat} onPress={() => openModule('TodoStack')}>
          <IconView
            iconType="Ionicons"
            name="checkbox-outline"
            size={sizes.iconSm}
            color={colors.primary}
          />
          <Spacer size="xxs" />
          <TextView text={`${todos}`} variant="body" align="center" />
          <TextView text={t('profile.openTodos')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('GameStack')}>
          <IconView
            iconType="Ionicons"
            name="dice-outline"
            size={sizes.iconSm}
            color={colors.primary}
          />
          <Spacer size="xxs" />
          <TextView text={`${coins}`} variant="body" align="center" />
          <TextView text={t('profile.gameCoins')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.stat} onPress={() => openModule('GalleryStack')}>
          <IconView
            iconType="Ionicons"
            name="heart-outline"
            size={sizes.iconSm}
            color={colors.primary}
          />
          <Spacer size="xxs" />
          <TextView text={`${favorites}`} variant="body" align="center" />
          <TextView text={t('profile.favorites')} variant="caption" muted align="center" />
        </Pressable>
      </View>

      <Spacer size="md" />
      <SectionHeader title={t('profile.quickModules')} />
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
      <View style={styles.menuList}>
        <Pressable
          style={styles.menuRow}
          onPress={() => rootNavigate('Settings', undefined)}>
          <View style={styles.menuIcon}>
            <IconView
              iconType="Ionicons"
              name="settings-outline"
              size={sizes.iconSm}
              color={colors.primary}
            />
          </View>
          <View style={styles.menuCopy}>
            <TextView text={t('profile.openSettings')} variant="body" />
          </View>
          <IconView
            iconType="Ionicons"
            name="chevron-forward"
            size={sizes.iconSm}
            color={colors.textMuted}
          />
        </Pressable>
        <Pressable
          style={[styles.menuRow, styles.menuRowLast]}
          onPress={() => navigation.openDrawer?.()}>
          <View style={styles.menuIcon}>
            <IconView
              iconType="Ionicons"
              name="menu-outline"
              size={sizes.iconSm}
              color={colors.primary}
            />
          </View>
          <View style={styles.menuCopy}>
            <TextView text={t('profile.openDrawer')} variant="body" />
          </View>
          <IconView
            iconType="Ionicons"
            name="chevron-forward"
            size={sizes.iconSm}
            color={colors.textMuted}
          />
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

export default Profile;
