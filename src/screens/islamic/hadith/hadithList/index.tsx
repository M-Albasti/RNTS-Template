import React, {useCallback, useEffect, useMemo} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import EmptyView from '@atoms/EmptyView';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {HADITH_PAGE_SIZE} from '@api/clients/hadithClient';
import {isWeakHadith} from '@api/mappers/islamic.mapper';
import {useHadithListInfiniteQuery} from '@api/query/hooks/useIslamicQueries';
import {isHadithRateLimitError} from '@helpers/hadithRateLimit';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {HadithSummary} from '@Types/islamicTypes';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'HadithList'>;
  route: AppRouteProp<'HadithList'>;
};

const HadithList = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const {colors} = useThemeTokens();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {slug, title, filter = 'all'} = route.params;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useHadithListInfiniteQuery(slug, language);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    banner: {
      backgroundColor: tokens.colors.hadithChrome,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
    },
    bannerText: {color: tokens.colors.hadithOnChrome},
    row: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderStartWidth: tokens.layout.borderWidth.lg,
      borderStartColor: tokens.colors.hadithChrome,
      ...tokens.shadows.sm,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary, ...tokens.shadows.none},
    index: {color: tokens.colors.hadithChrome},
    arabicPreview: {
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
    grade: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.successMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginTop: tokens.spacing.xs,
    },
    footer: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      gap: tokens.spacing.sm,
      paddingVertical: tokens.spacing.sm,
    },
    pageLabel: {flex: 1, alignItems: 'center' as const},
    listFooter: {
      paddingVertical: tokens.spacing.md,
      ...tokens.layout.presets.center,
      gap: tokens.spacing.xs,
    },
    hint: {marginBottom: tokens.spacing.xs},
  }));

  const rawItems = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data?.pages],
  );

  const items = useMemo(() => {
    if (filter !== 'weak') {
      return rawItems;
    }
    return rawItems.filter(item => isWeakHadith(item.grades));
  }, [filter, rawItems]);

  const total = data?.pages[0]?.total ?? 0;
  const pageSize = data?.pages[0]?.pageSize ?? HADITH_PAGE_SIZE;
  const loadedPages = data?.pages.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Auto-skip fully empty pages (blank API text filtered out / weak filter).
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) {
      return;
    }
    const lastPage = data?.pages[data.pages.length - 1];
    if (!lastPage) {
      return;
    }
    const lastVisible =
      filter === 'weak'
        ? lastPage.items.filter(item => isWeakHadith(item.grades))
        : lastPage.items;
    if (lastVisible.length === 0) {
      void fetchNextPage();
    }
  }, [
    data?.pages,
    fetchNextPage,
    filter,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  ]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const rateLimited =
    (isError || isFetchNextPageError) && isHadithRateLimitError(error);

  const renderItem = useCallback(
    ({item}: {item: HadithSummary}) => (
      <Pressable
        style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
        onPress={() =>
          navigation.navigate('HadithDetail', {
            hadithId: item.id,
            title: item.editionName,
          })
        }>
        <Heading text={`#${item.hadithIndex}`} level="h3" style={styles.index} />
        {item.bookName ? (
          <>
            <Spacer size="xxs" />
            <TextView text={item.bookName} variant="caption" muted />
          </>
        ) : null}
        <Spacer size="xs" />
        {item.arabicText ? (
          <>
            <TextView
              text={item.arabicText}
              variant="body"
              numberOfLines={2}
              style={styles.arabicPreview}
            />
            <Spacer size="xs" />
          </>
        ) : null}
        <TextView
          text={item.englishText || item.text}
          variant="bodySmall"
          numberOfLines={3}
          muted
        />
        {item.grades[0] ? (
          <View style={styles.grade}>
            <TextView text={item.grades[0].grade} variant="caption" />
          </View>
        ) : null}
      </Pressable>
    ),
    [navigation, styles],
  );

  const listFooter = useMemo(
    () => (
      <View style={styles.listFooter}>
        {isFetchingNextPage ? (
          <>
            <ActivityIndicator color={colors.primary} />
            <TextView text={t('islamic.hadith.loadingMore')} variant="caption" muted />
          </>
        ) : hasNextPage ? (
          <TextView text={t('islamic.hadith.scrollForMore')} variant="caption" muted />
        ) : items.length > 0 ? (
          <TextView text={t('islamic.hadith.endOfList')} variant="caption" muted />
        ) : null}
      </View>
    ),
    [
      colors.primary,
      hasNextPage,
      isFetchingNextPage,
      items.length,
      styles.listFooter,
      t,
    ],
  );

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading && !data ? (
        <IslamicLoadingState />
      ) : isError && !data ? (
        <IslamicErrorState
          message={
            rateLimited
              ? t('islamic.hadith.rateLimited')
              : t('islamic.errors.loadFailed')
          }
        />
      ) : (
        <>
          <View style={styles.banner}>
            <TextView text={title} variant="bodySmall" style={styles.bannerText} />
            <TextView
              text={t('islamic.hadith.loadedInfo', {
                loaded: items.length,
                total,
                page: loadedPages,
                totalPages,
              })}
              variant="caption"
              style={styles.bannerText}
            />
          </View>
          {rateLimited ? (
            <>
              <Spacer size="xs" />
              <TextView
                text={t('islamic.hadith.rateLimitedHint')}
                variant="caption"
                style={styles.hint}
              />
              <Button
                label={t('islamic.common.retry')}
                variant="secondary"
                loading={isFetchingNextPage}
                onPress={() => void refetch()}
              />
            </>
          ) : null}
          <Spacer size="sm" />
          <FlashList
            data={items}
            style={styles.list}
            keyExtractor={item => item.id}
            drawDistance={800}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            ListEmptyComponent={
              <EmptyView
                compact
                title={
                  filter === 'weak' && rawItems.length > 0
                    ? t('islamic.hadith.noWeakOnPage')
                    : t('islamic.hadith.emptyPage')
                }
                iconName="book-outline"
              />
            }
            ListFooterComponent={listFooter}
            renderItem={renderItem}
          />
          <View style={styles.footer}>
            <View style={styles.pageLabel}>
              <TextView
                text={t('islamic.hadith.pageShort', {
                  page: loadedPages,
                  totalPages,
                })}
                variant="caption"
                muted
              />
            </View>
            <Button
              label={t('islamic.common.next')}
              variant="primary"
              size="sm"
              loading={isFetchingNextPage}
              disabled={!hasNextPage || isFetchingNextPage}
              onPress={loadMore}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
};

export default HadithList;
