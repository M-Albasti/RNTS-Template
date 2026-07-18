import React, {useCallback, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAdhkarCategoriesQuery} from '@api/query/hooks/useIslamicQueries';
import {
  filterCategoriesByGroup,
  getAdhkarGroupById,
  type AdhkarCategoryGroupId,
} from '@constants/adhkarSessions';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AdhkarCategory} from '@Types/islamicTypes';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'AdhkarGroup'>;
  route: AppRouteProp<'AdhkarGroup'>;
};

/**
 * Pretty chapter cards for one adhkar group (Daily, Home, Other, …).
 */
const AdhkarGroup = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {sizes} = useThemeTokens();
  const groupId = route.params.groupId as AdhkarCategoryGroupId;
  const group = getAdhkarGroupById(groupId);
  const title = route.params.title || t(group.titleKey);
  const {data, isLoading, isError} = useAdhkarCategoriesQuery(lang);

  const chapters = useMemo(
    () => filterCategoriesByGroup(data ?? [], groupId),
    [data, groupId],
  );

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    banner: {
      backgroundColor: tokens.colors.mushafBanner,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.mushafBorder,
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      alignItems: 'center' as const,
    },
    bannerIcon: {
      width: tokens.sizes.touchTarget,
      height: tokens.sizes.touchTarget,
      borderRadius: tokens.radius.lg,
      backgroundColor: tokens.colors.mushafPage,
      ...tokens.layout.presets.center,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.mushafOrnament,
    },
    bannerText: {flex: tokens.layout.flex.fill},
    card: {
      backgroundColor: tokens.colors.mushafPage,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.mushafBorder,
      borderStartWidth: tokens.layout.borderWidth.lg,
      borderStartColor: tokens.colors.mushafOrnament,
      ...tokens.shadows.md,
    },
    cardPressed: {
      backgroundColor: tokens.colors.mushafBanner,
      ...tokens.shadows.none,
    },
    cardRow: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      gap: tokens.spacing.sm,
    },
    cardBody: {flex: tokens.layout.flex.fill},
    meta: {
      alignSelf: 'flex-start' as const,
      marginTop: tokens.spacing.xs,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
  }));

  const renderChapter = useCallback(
    ({item, index}: {item: AdhkarCategory; index: number}) => (
      <Pressable
        style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('AdhkarReader', {
            categoryId: item.id,
            title: item.title,
          })
        }>
        <View style={styles.cardRow}>
          <View style={styles.cardBody}>
            <Heading text={item.title} level="h3" />
            <View style={styles.meta}>
              <TextView
                text={t('islamic.adhkar.chapterIndex', {n: index + 1})}
                variant="caption"
              />
            </View>
            <Spacer size="xxs" />
            <TextView text={t('islamic.adhkar.listenCategory')} variant="caption" muted />
          </View>
          <IconView iconType="Ionicons" name="play-circle-outline" size={sizes.iconMd} />
        </View>
      </Pressable>
    ),
    [navigation, sizes.iconMd, styles, t],
  );

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={chapters}
          style={styles.list}
          keyExtractor={item => String(item.id)}
          ListHeaderComponent={
            <View style={styles.banner}>
              <View style={styles.bannerIcon}>
                <IconView iconType="Ionicons" name={group.icon} size={sizes.iconSm} />
              </View>
              <View style={styles.bannerText}>
                <TextView text={t(group.subtitleKey)} variant="bodySmall" />
                <Spacer size="xxs" />
                <TextView
                  text={t('islamic.adhkar.groupChapterCount', {count: chapters.length})}
                  variant="caption"
                  muted
                />
              </View>
            </View>
          }
          ListEmptyComponent={
            <TextView text={t('islamic.adhkar.noCategoriesInGroup')} variant="bodySmall" muted />
          }
          renderItem={renderChapter}
        />
      )}
    </ScreenContainer>
  );
};

export default AdhkarGroup;
