import React, {useCallback, useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAdhkarCategoriesQuery} from '@api/query/hooks/useIslamicQueries';
import {
  ADHKAR_BROWSE_GROUPS,
  ADHKAR_SESSIONS,
  partitionCategoriesByGroup,
  type AdhkarCategoryGroupId,
  type AdhkarSessionId,
} from '@constants/adhkarSessions';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'AdhkarCategories'>};

const SESSION_ACCENT_KEYS: Record<
  AdhkarSessionId,
  'accent1' | 'accent2' | 'accent3' | 'primary' | 'success' | 'warning'
> = {
  morning: 'warning',
  evening: 'accent2',
  sleep: 'accent3',
  waking: 'success',
  afterPrayer: 'primary',
  dayNight: 'accent1',
};

const GROUP_ACCENT_KEYS: Record<
  AdhkarCategoryGroupId,
  'accent1' | 'accent2' | 'accent3' | 'primary' | 'success' | 'warning'
> = {
  daily: 'warning',
  home: 'accent1',
  prayer: 'primary',
  travel: 'accent2',
  protection: 'success',
  other: 'accent3',
};

/**
 * Adhkar hub — daily listen cards + category group cards (no filter chips).
 * Every Hisn chapter is placed in a group; leftovers go to "Other adhkar".
 */
const AdhkarCategories = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {colors} = useThemeTokens();
  const {data, isLoading, isError} = useAdhkarCategoriesQuery(lang);

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.mushafBorderOuter,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.md,
      borderColor: tokens.colors.mushafOrnament,
      ...tokens.shadows.md,
    },
    heroInner: {
      backgroundColor: tokens.colors.mushafPage,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.mushafBorder,
    },
    heroTitle: {color: tokens.colors.mushafInk},
    heroCaption: {color: tokens.colors.mushafMeta},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  }));

  const sessions = useMemo(
    () =>
      ADHKAR_SESSIONS.map(session => ({
        ...session,
        title: t(session.titleKey),
        subtitle: t(session.subtitleKey),
        accent: colors[SESSION_ACCENT_KEYS[session.id]],
      })),
    [colors, t],
  );

  const grouped = useMemo(() => partitionCategoriesByGroup(data ?? []), [data]);

  const groupCards = useMemo(
    () =>
      ADHKAR_BROWSE_GROUPS.map(group => {
        const count = grouped[group.id]?.length ?? 0;
        return {
          ...group,
          title: t(group.titleKey),
          subtitle: t('islamic.adhkar.groupChapterCount', {count}),
          accent: colors[GROUP_ACCENT_KEYS[group.id]],
          count,
        };
      }).filter(group => group.count > 0),
    [colors, grouped, t],
  );

  const openSession = useCallback(
    (sessionId: AdhkarSessionId) => {
      navigation.navigate('AdhkarReader', {sessionId});
    },
    [navigation],
  );

  const openGroup = useCallback(
    (groupId: AdhkarCategoryGroupId, title: string) => {
      navigation.navigate('AdhkarGroup', {groupId, title});
    },
    [navigation],
  );

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.adhkar.title')} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroInner}>
            <Heading
              text={t('islamic.adhkar.hubTitle')}
              level="h2"
              align="center"
              style={styles.heroTitle}
            />
            <Spacer size="xs" />
            <TextView
              text={t('islamic.adhkar.hubSubtitle')}
              variant="bodySmall"
              align="center"
              style={styles.heroCaption}
            />
          </View>
        </View>

        <Spacer size="lg" />
        <Heading text={t('islamic.adhkar.readers')} level="h3" />
        <Spacer size="xxs" />
        <TextView text={t('islamic.adhkar.readersSubtitle')} variant="caption" muted />
        <Spacer size="sm" />
        <View style={styles.grid}>
          {sessions.map(item => (
            <FeatureHubCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              iconType="Ionicons"
              iconName={item.icon}
              accentColor={item.accent}
              onPress={() => openSession(item.id)}
            />
          ))}
        </View>

        <Spacer size="lg" />
        <Heading text={t('islamic.adhkar.browseCategories')} level="h3" />
        <Spacer size="xxs" />
        <TextView text={t('islamic.adhkar.browseSubtitle')} variant="caption" muted />
        <Spacer size="sm" />

        {isLoading ? (
          <IslamicLoadingState />
        ) : isError ? (
          <IslamicErrorState message={t('islamic.errors.loadFailed')} />
        ) : (
          <View style={styles.grid}>
            {groupCards.map(item => (
              <FeatureHubCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                iconType="Ionicons"
                iconName={item.icon}
                accentColor={item.accent}
                onPress={() => openGroup(item.id, item.title)}
              />
            ))}
          </View>
        )}
        <Spacer size="xxl" />
      </ScrollView>
    </ScreenContainer>
  );
};

export default AdhkarCategories;
