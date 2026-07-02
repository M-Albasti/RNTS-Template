//* packages import
import React, {useCallback, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import {isEmpty} from 'lodash';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import FeatureHubCard from '@atoms/FeatureHubCard';
import AnimatedEntrance from '@atoms/AnimatedEntrance';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import SectionHeader from '@molecules/SectionHeader';

//* services import
import {logoutService} from '@services/authServices/logoutService';
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

//* api import
import {useDashboardQuery} from '@api/query/hooks/useDashboardQuery';

//* config import
import {WORKFLOW_STEP_IDS} from '@config/appWorkflow';
import {apiConfig} from '@config/apiConfig';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {changeLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveHomeStyles} from './styles/resolveHomeStyles';

//* types import
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

interface HomeProps {
  navigation: AppStackNavigationProp<'Home'>;
}

type HubModule = {
  titleKey: string;
  subtitleKey: string;
  route: keyof DrawerParamList;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  iconName: string;
  accent?: string;
  section: 'social' | 'commerce' | 'media';
};

const MODULE_SECTIONS: Array<'social' | 'commerce' | 'media'> = ['social', 'commerce', 'media'];

const MODULES: HubModule[] = [
  {
    titleKey: 'home.modules.feed.title',
    subtitleKey: 'home.modules.feed.subtitle',
    route: 'PostStack',
    iconType: 'Ionicons',
    iconName: 'newspaper-outline',
    section: 'social',
  },
  {
    titleKey: 'home.modules.todo.title',
    subtitleKey: 'home.modules.todo.subtitle',
    route: 'TodoStack',
    iconType: 'Ionicons',
    iconName: 'checkbox-outline',
    section: 'social',
  },
  {
    titleKey: 'home.modules.chat.title',
    subtitleKey: 'home.modules.chat.subtitle',
    route: 'ChatStack',
    iconType: 'Ionicons',
    iconName: 'chatbubbles-outline',
    section: 'social',
  },
  {
    titleKey: 'home.modules.delivery.title',
    subtitleKey: 'home.modules.delivery.subtitle',
    route: 'DeliveryStack',
    iconType: 'MaterialCommunityIcons',
    iconName: 'truck-delivery-outline',
    section: 'commerce',
  },
  {
    titleKey: 'home.modules.marketplace.title',
    subtitleKey: 'home.modules.marketplace.subtitle',
    route: 'MarketplaceStack',
    iconType: 'Ionicons',
    iconName: 'storefront-outline',
    section: 'commerce',
  },
  {
    titleKey: 'home.modules.wallet.title',
    subtitleKey: 'home.modules.wallet.subtitle',
    route: 'WalletStack',
    iconType: 'Ionicons',
    iconName: 'wallet-outline',
    section: 'commerce',
  },
  {
    titleKey: 'home.modules.gallery.title',
    subtitleKey: 'home.modules.gallery.subtitle',
    route: 'GalleryStack',
    iconType: 'Ionicons',
    iconName: 'images-outline',
    section: 'media',
  },
  {
    titleKey: 'home.modules.video.title',
    subtitleKey: 'home.modules.video.subtitle',
    route: 'VideoStack',
    iconType: 'Ionicons',
    iconName: 'videocam-outline',
    section: 'media',
  },
  {
    titleKey: 'home.modules.audio.title',
    subtitleKey: 'home.modules.audio.subtitle',
    route: 'AudioStack',
    iconType: 'Ionicons',
    iconName: 'musical-notes-outline',
    section: 'media',
  },
  {
    titleKey: 'home.modules.game.title',
    subtitleKey: 'home.modules.game.subtitle',
    route: 'GameStack',
    iconType: 'MaterialCommunityIcons',
    iconName: 'slot-machine',
    section: 'media',
  },
  {
    titleKey: 'home.modules.islamic.title',
    subtitleKey: 'home.modules.islamic.subtitle',
    route: 'IslamicStack',
    iconType: 'Ionicons',
    iconName: 'moon-outline',
  },
  {
    titleKey: 'home.modules.wordPuzzle.title',
    subtitleKey: 'home.modules.wordPuzzle.subtitle',
    route: 'WordPuzzleStack',
    iconType: 'Ionicons',
    iconName: 'grid-outline',
  },
];

const Home = ({navigation}: HomeProps): React.JSX.Element => {
  const user = useAppSelector(state => state?.auth?.user);
  const localPostsCount = useAppSelector(state => state.posts.posts.length);
  const localOpenTodos = useAppSelector(
    state => state.todos.items.filter(todo => !todo.done).length,
  );
  const localUnreadChats = useAppSelector(state =>
    state.chat.threads.reduce((sum, thread) => sum + thread.unread, 0),
  );
  const localBalance = useAppSelector(state => state.wallet.balance);
  const localCoins = useAppSelector(state => state.game.coins);
  const {data: dashboard, isFetching: isDashboardLoading} = useDashboardQuery(!!user);
  const postsCount = dashboard?.postsCount ?? localPostsCount;
  const openTodos = dashboard?.openTodos ?? localOpenTodos;
  const unreadChats = dashboard?.unreadChats ?? localUnreadChats;
  const balance = dashboard?.walletBalance ?? localBalance;
  const coins = dashboard?.gameCoins ?? localCoins;
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveHomeStyles);

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

  const displayName = user?.email?.split('@')[0] || t('common.guest');

  const greetingKey = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'home.greetingMorning';
    }
    if (hour < 18) {
      return 'home.greetingAfternoon';
    }
    return 'home.greetingEvening';
  }, []);

  const workflowSteps = useMemo(
    () =>
      WORKFLOW_STEP_IDS.map(id => ({
        id,
        title: t(`home.workflow.${id}.title`),
        description: t(`home.workflow.${id}.description`),
      })),
    [t],
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <View style={styles.hero}>
        <Heading
          text={t(greetingKey, {name: displayName})}
          level="h1"
          align="center"
          style={styles.heroText}
        />
        <Spacer size="xs" />
        <TextView text={t('home.purpose')} align="center" style={styles.heroText} />
        {apiConfig.useMocks ? (
          <>
            <Spacer size="xs" />
            <View style={styles.apiBadge}>
              <TextView
                text={t('home.mockApiActive')}
                variant="caption"
                muted
              />
            </View>
          </>
        ) : null}
      </View>

      <Spacer size="lg" />

      {isDashboardLoading ? (
        <TextView text={t('home.loadingDashboard')} variant="bodySmall" muted />
      ) : null}
      <Spacer size={isDashboardLoading ? 'sm' : 'none'} />

      <View style={styles.statsRow}>
        <Pressable style={styles.statPill} onPress={() => openModule('PostStack')}>
          <TextView
            text={t('home.postsCount', {count: postsCount})}
            variant="bodySmall"
            muted
          />
          <Heading text={t('home.feed')} level="h3" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('TodoStack')}>
          <TextView
            text={t('home.openTasks', {count: openTodos})}
            variant="bodySmall"
            muted
          />
          <Heading text={t('home.todos')} level="h3" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('ChatStack')}>
          <TextView
            text={t('home.unreadCount', {count: unreadChats})}
            variant="bodySmall"
            muted
          />
          <Heading text={t('home.chat')} level="h3" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('WalletStack')}>
          <TextView
            text={t('home.walletCoins', {
              balance: balance.toFixed(0),
              coins,
            })}
            variant="bodySmall"
            muted
          />
          <Heading text={t('home.walletGame')} level="h3" />
        </Pressable>
      </View>

      <Spacer size="lg" />
      <Heading text={t('home.appModules')} level="h2" />
      <Spacer size="md" />

      <View style={styles.grid}>
        {MODULES.map((module, index) => (
          <AnimatedEntrance key={module.route} delay={index * 40}>
            <FeatureHubCard
              title={t(module.titleKey)}
              subtitle={t(module.subtitleKey)}
              iconType={module.iconType}
              iconName={module.iconName}
              accentColor={module.accent}
              onPress={() => openModule(module.route)}
            />
          </AnimatedEntrance>
        ))}
      </View>
      <SectionHeader
        title={t('home.appModules')}
        subtitle={t('home.appModulesSubtitle')}
        actionLabel={t('home.openMenu')}
        onActionPress={() => drawerNav?.openDrawer()}
      />

      {MODULE_SECTIONS.map(section => {
        const sectionModules = MODULES.filter(module => module.section === section);
        return (
          <View key={section}>
            <Heading text={t(`home.sections.${section}`)} level="h3" />
            <Spacer size="sm" />
            <View style={styles.grid}>
              {sectionModules.map(module => (
                <FeatureHubCard
                  key={module.route}
                  title={t(module.titleKey)}
                  subtitle={t(module.subtitleKey)}
                  iconType={module.iconType}
                  iconName={module.iconName}
                  accentColor={module.accent}
                  onPress={() => openModule(module.route)}
                />
              ))}
            </View>
            <Spacer size="lg" />
          </View>
        );
      })}

      <Card elevated={false}>
        <Heading text={t('home.howItWorks')} level="h3" />
        <Spacer size="md" />
        {workflowSteps.map(step => (
          <View key={step.id}>
            <View style={styles.workflowStep}>
              <Heading text={step.title} level="h3" />
              <TextView text={step.description} variant="bodySmall" muted />
            </View>
            <Spacer size="sm" />
          </View>
        ))}
      </Card>

      <Spacer size="lg" />

      <Card elevated={false}>
        <Heading text={t('home.quickActions')} level="h3" />
        <Spacer size="md" />
        <View style={styles.actions}>
          <Button
            label={t('home.openMenu')}
            variant="secondary"
            flat
            fullWidth
            onPress={() => drawerNav?.openDrawer()}
          />
          <Button
            label={t('home.profile')}
            flat
            fullWidth
            onPress={() => openModule('Profile')}
          />
          <Button
            label={t('home.settings')}
            variant="outline"
            fullWidth
            onPress={() => rootNavigate('Settings', undefined)}
          />
          <Button
            label={t('home.changeLanguage')}
            variant="ghost"
            fullWidth
            onPress={() => changeLanguage(dispatch)}
          />
          <Button
            label={t('home.logout')}
            variant="danger"
            flat
            fullWidth
            onPress={logout}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
};

export default Home;
