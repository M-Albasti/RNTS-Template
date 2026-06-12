//* packages import
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import {isEmpty} from 'lodash';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* services import
import {logoutService} from '@services/authServices/logoutService';
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {changeLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

interface HomeProps {
  navigation: AppStackNavigationProp<'Home'>;
}

type HubModule = {
  title: string;
  subtitle: string;
  route: keyof DrawerParamList;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  iconName: string;
  accent?: string;
};

const MODULES: HubModule[] = [
  {title: 'Social feed', subtitle: 'Posts, likes & comments', route: 'PostStack', iconType: 'Ionicons', iconName: 'newspaper-outline'},
  {title: 'Todo list', subtitle: 'Tasks & reminders', route: 'TodoStack', iconType: 'Ionicons', iconName: 'checkbox-outline'},
  {title: 'Chat', subtitle: 'Messages & threads', route: 'ChatStack', iconType: 'Ionicons', iconName: 'chatbubbles-outline'},
  {title: 'Lucky spinner', subtitle: 'Spin & win coins', route: 'GameStack', iconType: 'MaterialCommunityIcons', iconName: 'slot-machine'},
  {title: 'Wallet', subtitle: 'Balance & transfers', route: 'WalletStack', iconType: 'Ionicons', iconName: 'wallet-outline'},
  {title: 'Gallery', subtitle: 'Browse your photos', route: 'GalleryStack', iconType: 'Ionicons', iconName: 'images-outline'},
  {title: 'Videos', subtitle: 'Record & playback', route: 'VideoStack', iconType: 'Ionicons', iconName: 'videocam-outline'},
  {title: 'Audios', subtitle: 'Record & listen', route: 'AudioStack', iconType: 'Ionicons', iconName: 'musical-notes-outline'},
];

const Home = ({navigation}: HomeProps): React.JSX.Element => {
  const user = useAppSelector(state => state?.auth?.user);
  const postsCount = useAppSelector(state => state.posts.posts.length);
  const openTodos = useAppSelector(state => state.todos.items.filter(t => !t.done).length);
  const unreadChats = useAppSelector(state => state.chat.threads.reduce((sum, t) => sum + t.unread, 0));
  const balance = useAppSelector(state => state.wallet.balance);
  const coins = useAppSelector(state => state.game.coins);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        backgroundColor: tokens.colors.primary,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        ...tokens.layout.presets.columnCenter,
        borderWidth: tokens.layout.borderWidth.none,
      },
      heroText: {color: tokens.colors.textInverse},
      statsRow: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      statPill: {
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radius.md,
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        minWidth: '46%' as const,
        flex: tokens.layout.flex.fill,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      actions: {gap: tokens.spacing.sm},
    }),
  );

  const drawerNav = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();

  const openModule = useCallback(
    (route: keyof DrawerParamList) => {
      drawerNav?.navigate(route);
    },
    [drawerNav],
  );

  const logout = useCallback(() => {
    if (!isEmpty(user)) {
      logoutService(user?.loginType, dispatch);
    }
  }, [dispatch, user]);

  const displayName = user?.email?.split('@')[0] || 'Guest';

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <View style={styles.hero}>
        <Heading
          text={`${t('Home', {defaultValue: 'Home'})}, ${displayName}`}
          level="h1"
          align="center"
        />
        <Spacer size="xs" />
        <TextView
          text="Your all-in-one hub — social, productivity, chat, games, wallet & media."
          align="center"
          style={styles.heroText}
        />
      </View>

      <Spacer size="lg" />

      <View style={styles.statsRow}>
        <Pressable style={styles.statPill} onPress={() => openModule('PostStack')}>
          <TextView text={`${postsCount} posts`} variant="bodySmall" muted />
          <Heading text="Feed" level="h3" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('TodoStack')}>
          <TextView text={`${openTodos} open tasks`} variant="bodySmall" muted />
          <Heading text="Todos" level="h3" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('ChatStack')}>
          <TextView text={`${unreadChats} unread`} variant="bodySmall" muted />
          <Heading text="Chat" level="h3" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('WalletStack')}>
          <TextView text={`$${balance.toFixed(0)} · ${coins} coins`} variant="bodySmall" muted />
          <Heading text="Wallet & game" level="h3" />
        </Pressable>
      </View>

      <Spacer size="lg" />
      <Heading text="App modules" level="h2" />
      <Spacer size="md" />

      <View style={styles.grid}>
        {MODULES.map(module => (
          <FeatureHubCard
            key={module.route}
            title={module.title}
            subtitle={module.subtitle}
            iconType={module.iconType}
            iconName={module.iconName}
            accentColor={module.accent}
            onPress={() => openModule(module.route)}
          />
        ))}
      </View>

      <Spacer size="lg" />

      <Card>
        <Heading text="Quick actions" level="h3" />
        <Spacer size="md" />
        <View style={styles.actions}>
          <Button label="Open menu" variant="secondary" fullWidth onPress={() => drawerNav?.openDrawer()} />
          <Button label="Profile" fullWidth onPress={() => openModule('Profile')} />
          <Button label="Settings" variant="outline" fullWidth onPress={() => rootNavigate('Settings', undefined)} />
          <Button label="Change language" variant="ghost" fullWidth onPress={() => changeLanguage(dispatch)} />
          <Button label="Logout" variant="danger" fullWidth onPress={logout} />
        </View>
      </Card>
    </ScreenContainer>
  );
};

export default Home;
