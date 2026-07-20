//* packages import
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import {isEmpty} from 'lodash';

//* components import
import BottomSheet from '@atoms/BottomSheet';
import Button from '@atoms/Button';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import {FLOATING_TAB_CONTENT_INSET} from '@navigation/TabNavigator/styles/resolveFloatingTabBarStyles';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import SectionHeader from '@molecules/SectionHeader';

//* services import
import {logoutService} from '@services/authServices/logoutService';
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

//* api import
import {useDashboardQuery} from '@api/query/hooks/useDashboardQuery';

//* config import
import {apiConfig} from '@config/apiConfig';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {setAppLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveHomeStyles} from './styles/resolveHomeStyles';

//* types import
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';
import type {FontsFamily} from '@Types/fontsFamily';
import type {Languages} from '@Types/languages';

interface HomeProps {
  navigation: AppStackNavigationProp<'Home'>;
}

type HubModule = {
  titleKey: string;
  subtitleKey: string;
  route: keyof DrawerParamList;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  iconName: string;
  section: 'social' | 'commerce' | 'media';
};

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
    section: 'media',
  },
  {
    titleKey: 'home.modules.wordPuzzle.title',
    subtitleKey: 'home.modules.wordPuzzle.subtitle',
    route: 'WordPuzzleStack',
    iconType: 'Ionicons',
    iconName: 'grid-outline',
    section: 'media',
  },
];

const MODULE_SECTIONS: Array<'social' | 'commerce' | 'media'> = [
  'social',
  'commerce',
  'media',
];

const Home = ({navigation}: HomeProps): React.JSX.Element => {
  const user = useAppSelector(state => state?.auth?.user);
  const lang = useAppSelector(state => state.appSettings.lang);
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
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveHomeStyles);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);
  const [draftLang, setDraftLang] = useState<Languages>(lang);

  useEffect(() => {
    if (languageSheetOpen) {
      setDraftLang(lang);
    }
  }, [lang, languageSheetOpen]);

  const closeLanguageSheet = () => setLanguageSheetOpen(false);

  const confirmLanguage = () => {
    if (draftLang !== lang) {
      void setAppLanguage(dispatch, draftLang);
    }
    closeLanguageSheet();
  };

  const drawerNav = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();

  const openModule = useCallback(
    (route: keyof DrawerParamList) => {
      drawerNav?.navigate(route);
    },
    [drawerNav],
  );

  const logout = useCallback(() => {
    if (isEmpty(user)) {
      return;
    }
    Alert.alert(t('drawer.logout'), t('drawer.logoutConfirm'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('drawer.logout'),
        style: 'destructive',
        onPress: () => {
          void logoutService(user.loginType, dispatch);
        },
      },
    ]);
  }, [dispatch, t, user]);

  const quickActions = useMemo(
    () =>
      [
        {
          key: 'profile',
          label: t('home.profile'),
          icon: 'person-outline',
          iconType: 'Ionicons' as FontsFamily,
          onPress: () => openModule('Profile'),
        },
        {
          key: 'settings',
          label: t('home.settings'),
          icon: 'settings-outline',
          iconType: 'Ionicons' as FontsFamily,
          onPress: () => rootNavigate('Settings', undefined),
        },
        {
          key: 'language',
          label: t('home.changeLanguage'),
          icon: 'language-outline',
          iconType: 'Ionicons' as FontsFamily,
          onPress: () => setLanguageSheetOpen(true),
        },
        {
          key: 'menu',
          label: t('home.openMenu'),
          icon: 'menu-outline',
          iconType: 'Ionicons' as FontsFamily,
          onPress: () => drawerNav?.openDrawer(),
        },
      ] as const,
    [drawerNav, openModule, t],
  );

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

  return (
    <ScreenContainer
      scroll
      bottomPadding="xxl"
      contentStyle={{paddingBottom: FLOATING_TAB_CONTENT_INSET}}>
      <ScreenHeader
        title={t('home.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'services',
            iconName: 'grid-outline',
            onPress: () => navigation.navigate('ServicesHub'),
            accessibilityLabel: t('tabs.services'),
          },
          {
            key: 'profile',
            iconName: 'person-outline',
            onPress: () => navigation.navigate('Profile'),
            accessibilityLabel: t('tabs.profile'),
          },
        ]}
      />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <TextView
            text={t(greetingKey, {name: displayName})}
            variant="caption"
            style={styles.heroEyebrow}
          />
          <Heading text={t('home.purpose')} level="h2" />
          {apiConfig.useMocks ? (
            <View style={styles.apiBadge}>
              <TextView text={t('home.mockApiActive')} variant="caption" muted />
            </View>
          ) : null}
        </View>
      </View>

      {isDashboardLoading ? (
        <TextView text={t('home.loadingDashboard')} variant="bodySmall" muted />
      ) : null}

      <View style={styles.statsRow}>
        <Pressable style={styles.statPill} onPress={() => openModule('PostStack')}>
          <TextView text={`${postsCount}`} variant="h3" align="center" />
          <TextView text={t('home.feed')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('TodoStack')}>
          <TextView text={`${openTodos}`} variant="h3" align="center" />
          <TextView text={t('home.todos')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('ChatStack')}>
          <TextView text={`${unreadChats}`} variant="h3" align="center" />
          <TextView text={t('home.chat')} variant="caption" muted align="center" />
        </Pressable>
        <Pressable style={styles.statPill} onPress={() => openModule('WalletStack')}>
          <TextView text={`$${balance.toFixed(0)}`} variant="h3" align="center" />
          <TextView text={t('home.walletGame')} variant="caption" muted align="center" />
        </Pressable>
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
          <View key={section} style={styles.sectionBlock}>
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
                  onPress={() => openModule(module.route)}
                />
              ))}
            </View>
          </View>
        );
      })}

      <View style={styles.quickBlock}>
        <Heading text={t('home.quickActions')} level="h3" />
        <View style={styles.quickGrid}>
          {quickActions.map(action => (
            <Pressable
              key={action.key}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={({pressed}) => [
                styles.quickTile,
                pressed && styles.quickTilePressed,
              ]}>
              <View style={styles.quickIcon}>
                <IconView
                  iconType={action.iconType}
                  name={action.icon}
                  size={sizes.iconSm}
                  color={colors.primary}
                />
              </View>
              <TextView text={action.label} variant="bodySmall" />
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.logout')}
          onPress={logout}
          style={({pressed}) => [
            styles.logoutRow,
            pressed && styles.logoutRowPressed,
          ]}>
          <IconView
            iconType="Ionicons"
            name="log-out-outline"
            size={20}
            color={colors.error}
          />
          <TextView text={t('home.logout')} variant="body" style={styles.logoutLabel} />
        </Pressable>
      </View>

      <BottomSheet
        visible={languageSheetOpen}
        onClose={closeLanguageSheet}
        title={t('settings.language')}
        subtitle={t('settings.languageSheetHint')}
        footer={
          <View style={styles.sheetActions}>
            <Button
              label={t('common.cancel')}
              variant="outline"
              flat
              fullWidth
              style={styles.sheetActionButton}
              onPress={closeLanguageSheet}
            />
            <Button
              label={t('common.confirm')}
              variant="primary"
              flat
              fullWidth
              style={styles.sheetActionButton}
              onPress={confirmLanguage}
            />
          </View>
        }>
        {(
          [
            {code: 'en' as Languages, labelKey: 'common.english'},
            {code: 'ar' as Languages, labelKey: 'common.arabic'},
          ] as const
        ).map(option => {
          const active = draftLang === option.code;
          return (
            <Pressable
              key={option.code}
              style={[styles.sheetOption, active && styles.sheetOptionActive]}
              onPress={() => setDraftLang(option.code)}>
              <TextView text={t(option.labelKey)} variant="body" />
              {active ? (
                <IconView
                  iconType="Ionicons"
                  name="checkmark-circle"
                  size={22}
                  color={colors.primary}
                />
              ) : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </ScreenContainer>
  );
};

export default Home;
