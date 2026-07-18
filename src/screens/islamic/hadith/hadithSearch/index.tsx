import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import EmptyView from '@atoms/EmptyView';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';
import IslamicSearchSuggestions from '@molecules/islamic/IslamicSearchSuggestions';

import {
  HADITH_PAGE_SIZE,
  type HadithCollectionFilter,
} from '@api/clients/hadithClient';
import {
  useHadithEditionsQuery,
  useHadithSearchQuery,
} from '@api/query/hooks/useIslamicQueries';
import {
  SEARCH_DEBOUNCE_MS,
  buildFeaturedHadithSuggestions,
  buildRecentSuggestions,
  filterByQuery,
  normalizeSearchQuery,
  type IslamicSearchSuggestion,
} from '@helpers/islamicSearchHelpers';
import {useDebounce} from '@hooks/useInputDebounce';
import {useIslamicSearchHistory} from '@hooks/useIslamicSearchHistory';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'HadithSearch'>};

const FILTERS: HadithCollectionFilter[] = ['all', 'sahih', 'weak'];

const HadithSearch = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HadithCollectionFilter>('all');
  const [page, setPage] = useState(1);
  const {history, add, clear, remove} = useIslamicSearchHistory();

  const trimmedQuery = normalizeSearchQuery(query);
  const debouncedQuery = normalizeSearchQuery(String(useDebounce(query, SEARCH_DEBOUNCE_MS)));
  const isDebouncing = trimmedQuery.length > 0 && trimmedQuery !== debouncedQuery;
  const activeQuery = isDebouncing ? '' : debouncedQuery;

  useEffect(() => {
    setPage(1);
  }, [activeQuery, filter]);

  const {data, isFetching, isError} = useHadithSearchQuery(
    activeQuery.length >= 2 ? activeQuery : '',
    filter,
    language,
    page,
  );
  const {data: editions} = useHadithEditionsQuery();

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    filters: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.xs,
      marginBottom: tokens.spacing.md,
    },
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    chipActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    footer: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      gap: tokens.spacing.sm,
      paddingTop: tokens.spacing.sm,
    },
    pageLabel: {flex: 1, alignItems: 'center' as const},
  }));

  const pageSize = data?.pageSize ?? HADITH_PAGE_SIZE;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canGoNext = page < totalPages && !isFetching;
  const canGoPrev = page > 1 && !isFetching;

  const recentSuggestions = useMemo(
    () => buildRecentSuggestions(history, trimmedQuery),
    [history, trimmedQuery],
  );

  const dataSuggestions = useMemo(() => {
    const featured = buildFeaturedHadithSuggestions(language, trimmedQuery);
    const fromEditions: IslamicSearchSuggestion[] = filterByQuery(
      editions ?? [],
      trimmedQuery,
      item => `${item.name} ${item.slug}`,
    )
      .slice(0, 6)
      .map(item => ({
        id: `edition-${item.slug}`,
        label: item.name,
        query: item.name,
        kind: 'hadith' as const,
      }));

    const seen = new Set<string>();
    return [...featured, ...fromEditions]
      .filter(item => {
        const key = item.query.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, 10);
  }, [editions, language, trimmedQuery]);

  const showIdle = trimmedQuery.length === 0;
  const showLoading = !showIdle && (isDebouncing || (isFetching && page === 1));
  const keepTyping = !showIdle && !isDebouncing && activeQuery.length < 2;
  const showResults = !showIdle && !showLoading && !keepTyping && !isError;

  const openResult = (hadithId: string, title: string) => {
    add(trimmedQuery || title, 'hadith');
    navigation.navigate('HadithDetail', {hadithId, title});
  };

  const onSelectSuggestion = (suggestion: IslamicSearchSuggestion) => {
    setQuery(suggestion.query);
    add(suggestion.query, 'hadith');
  };

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.hadith.search')} onBack={() => navigation.goBack()} />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={t('islamic.hadith.searchPlaceholder')}
        autoFocus
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <Spacer size="md" />
      <View style={styles.filters}>
        {FILTERS.map(item => (
          <Pressable
            key={item}
            style={[styles.chip, filter === item && styles.chipActive]}
            onPress={() => setFilter(item)}>
            <TextView
              text={t(`islamic.hadith.filters.${item}`)}
              variant="caption"
              style={filter === item ? {color: '#fff'} : undefined}
            />
          </Pressable>
        ))}
      </View>
      {showIdle ? (
        <>
          <TextView text={t('islamic.hadith.searchHint')} variant="body" muted />
          <Spacer size="md" />
          <IslamicSearchSuggestions
            recent={recentSuggestions}
            suggestions={dataSuggestions}
            onSelect={onSelectSuggestion}
            onClearHistory={clear}
            onRemoveRecent={remove}
          />
          {recentSuggestions.length === 0 && dataSuggestions.length === 0 ? (
            <EmptyView
              compact
              iconName="search-outline"
              title={t('islamic.search.emptyTitle')}
              message={t('islamic.hadith.searchHint')}
            />
          ) : null}
        </>
      ) : showLoading ? (
        <IslamicLoadingState />
      ) : keepTyping ? (
        <EmptyView
          compact
          iconName="search-outline"
          title={t('islamic.search.keepTypingTitle')}
          message={t('islamic.search.keepTypingMessage')}
        />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : showResults ? (
        <>
          {total > 0 ? (
            <>
              <TextView
                text={t('islamic.hadith.pageInfo', {page, totalPages, total})}
                variant="caption"
                muted
              />
              <Spacer size="sm" />
            </>
          ) : null}
          <FlashList
            data={data?.items ?? []}
            style={styles.list}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <EmptyView
                compact
                iconName="file-tray-outline"
                title={t('islamic.hadith.noResults')}
                message={t('islamic.search.noResultsMessage')}
                actionLabel={t('islamic.search.trySuggestion')}
                onAction={() => setQuery('')}
              />
            }
            renderItem={({item}) => (
              <Pressable
                style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => openResult(item.id, item.editionName)}>
                <Heading text={item.editionName} level="h3" />
                <Spacer size="xs" />
                <TextView text={item.text} variant="body" numberOfLines={4} muted />
              </Pressable>
            )}
          />
          {totalPages > 1 ? (
            <>
              <Spacer size="md" />
              <View style={styles.footer}>
                <Button
                  label={t('islamic.common.previous')}
                  variant="secondary"
                  onPress={() => setPage(current => Math.max(1, current - 1))}
                  disabled={!canGoPrev}
                />
                <View style={styles.pageLabel}>
                  <TextView text={`${page} / ${totalPages}`} variant="caption" muted />
                </View>
                <Button
                  label={t('islamic.common.next')}
                  variant="primary"
                  onPress={() => setPage(current => Math.min(totalPages, current + 1))}
                  disabled={!canGoNext}
                />
              </View>
            </>
          ) : null}
        </>
      ) : null}
    </ScreenContainer>
  );
};

export default HadithSearch;
