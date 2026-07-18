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

import {quranClient} from '@api/clients/quranClient';
import {
  HADITH_PAGE_SIZE,
} from '@api/clients/hadithClient';
import {
  useAdhkarSearchQuery,
  useHadithSearchQuery,
  useQuranSearchQuery,
  useQuranSurahNameSearchQuery,
} from '@api/query/hooks/useIslamicQueries';
import {
  SEARCH_DEBOUNCE_MS,
  buildFeaturedAdhkarSuggestions,
  buildFeaturedHadithSuggestions,
  buildPopularSurahSuggestions,
  buildRecentSuggestions,
  normalizeSearchQuery,
  type IslamicSearchHistoryScope,
  type IslamicSearchSuggestion,
} from '@helpers/islamicSearchHelpers';
import {useDebounce} from '@hooks/useInputDebounce';
import {useIslamicSearchHistory} from '@hooks/useIslamicSearchHistory';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {QuranSearchMode} from '@Types/islamicTypes';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'IslamicUnifiedSearch'>};

type ScopeTab = IslamicSearchHistoryScope;

type SearchResult =
  | {
      kind: 'quran';
      id: string;
      title: string;
      subtitle: string;
      surahNumber: number;
      ayahNumber?: number;
    }
  | {
      kind: 'adhkar';
      id: string;
      title: string;
      subtitle: string;
      categoryId: number;
      itemId?: number;
    }
  | {
      kind: 'hadith';
      id: string;
      title: string;
      subtitle: string;
      hadithId: string;
    };

const IslamicUnifiedSearch = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<ScopeTab>('all');
  const [quranMode, setQuranMode] = useState<QuranSearchMode>('text');
  const [hadithPage, setHadithPage] = useState(1);
  const {history, add, clear, remove} = useIslamicSearchHistory();

  const trimmedQuery = normalizeSearchQuery(query);
  const debouncedQuery = normalizeSearchQuery(String(useDebounce(query, SEARCH_DEBOUNCE_MS)));
  const isDebouncing = trimmedQuery.length > 0 && trimmedQuery !== debouncedQuery;
  const activeQuery = isDebouncing ? '' : debouncedQuery;

  useEffect(() => {
    setHadithPage(1);
  }, [activeQuery, scope]);

  const showQuran = scope === 'all' || scope === 'quran';
  const showAdhkar = scope === 'all' || scope === 'adhkar';
  const showHadith = scope === 'all' || scope === 'hadith';

  // Scope "all" searches every Quran path together for comprehensive coverage.
  const includeSurahSearch =
    showQuran &&
    (scope === 'all' || quranMode === 'surah') &&
    activeQuery.length >= 1;
  const includeTextSearch =
    showQuran &&
    (scope === 'all' || quranMode === 'text') &&
    activeQuery.length >= 2;
  const includeAyahSearch =
    showQuran &&
    (scope === 'all' || quranMode === 'ayah') &&
    activeQuery.length >= 1;
  const adhkarSearchEnabled = showAdhkar && activeQuery.length >= 2;
  const hadithSearchEnabled = showHadith && activeQuery.length >= 2;

  const ayahRef = useMemo(
    () => (includeAyahSearch ? quranClient.resolveAyahReference(activeQuery) : null),
    [includeAyahSearch, activeQuery],
  );

  const {data: surahResults, isFetching: surahLoading} = useQuranSurahNameSearchQuery(
    includeSurahSearch ? activeQuery : '',
  );
  const {data: textResults, isFetching: textLoading, isError: textError} = useQuranSearchQuery(
    includeTextSearch ? activeQuery : '',
    language === 'ar' ? 'ar' : 'en',
  );
  const {data: adhkarResults, isFetching: adhkarLoading, isError: adhkarError} =
    useAdhkarSearchQuery(adhkarSearchEnabled ? activeQuery : '', language as 'ar' | 'en');
  const {
    data: hadithResults,
    isFetching: hadithLoading,
    isError: hadithError,
    refetch: refetchHadith,
  } = useHadithSearchQuery(
    hadithSearchEnabled ? activeQuery : '',
    'all',
    language,
    hadithPage,
  );

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    tabs: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.xs,
      marginBottom: tokens.spacing.sm,
    },
    tab: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    tabActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    kind: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginBottom: tokens.spacing.xxs,
    },
    footer: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      gap: tokens.spacing.sm,
      paddingTop: tokens.spacing.sm,
    },
    pageLabel: {flex: 1, alignItems: 'center' as const},
    fetchingHint: {marginBottom: tokens.spacing.sm},
  }));

  const results = useMemo((): SearchResult[] => {
    const merged: SearchResult[] = [];

    if (showQuran && includeAyahSearch && ayahRef) {
      merged.push({
        kind: 'quran',
        id: `ayah-${ayahRef.surahNumber}-${ayahRef.ayahNumber}`,
        title: t('islamic.search.ayahResult', {
          surah: ayahRef.surahNumber,
          ayah: ayahRef.ayahNumber,
        }),
        subtitle: t('islamic.search.openAyah'),
        surahNumber: ayahRef.surahNumber,
        ayahNumber: ayahRef.ayahNumber,
      });
    }

    if (showQuran && includeSurahSearch && surahResults) {
      merged.push(
        ...surahResults.map(item => ({
          kind: 'quran' as const,
          id: `surah-${item.number}`,
          title: `${item.name} · ${item.englishName}`,
          subtitle: t('islamic.search.surahAyahs', {count: item.numberOfAyahs}),
          surahNumber: item.number,
        })),
      );
    }

    if (showQuran && includeTextSearch && textResults) {
      merged.push(
        ...textResults.map(item => ({
          kind: 'quran' as const,
          id: `text-${item.surah.number}-${item.numberInSurah}`,
          title: `${item.surah.name || item.surah.englishName} ${item.numberInSurah}`,
          subtitle: item.text,
          surahNumber: item.surah.number,
          ayahNumber: item.numberInSurah,
        })),
      );
    }

    if (showAdhkar && adhkarResults) {
      merged.push(
        ...adhkarResults.map(item => ({
          kind: 'adhkar' as const,
          id: item.isCategoryMatch
            ? `adhkar-cat-${item.categoryId}`
            : `adhkar-${item.categoryId}-${item.itemId}`,
          title: item.categoryTitle,
          subtitle: item.isCategoryMatch
            ? t('islamic.search.adhkarCategory')
            : `${t('islamic.search.adhkarDhikr')} · ${
                item.arabicText || item.translatedText
              }`,
          categoryId: item.categoryId,
          itemId: item.isCategoryMatch ? undefined : item.itemId,
        })),
      );
    }

    if (showHadith && hadithResults?.items) {
      merged.push(
        ...hadithResults.items.map(item => ({
          kind: 'hadith' as const,
          id: `hadith-${item.id}`,
          title: item.editionName,
          subtitle: item.text,
          hadithId: item.id,
        })),
      );
    }

    return merged;
  }, [
    adhkarResults,
    ayahRef,
    hadithResults,
    includeAyahSearch,
    includeSurahSearch,
    includeTextSearch,
    showAdhkar,
    showHadith,
    showQuran,
    surahResults,
    t,
    textResults,
  ]);

  const localFetching =
    (includeSurahSearch && surahLoading) ||
    (includeTextSearch && textLoading) ||
    (adhkarSearchEnabled && adhkarLoading);
  const isFetching = localFetching || (hadithSearchEnabled && hadithLoading);

  const hadithPageSize = hadithResults?.pageSize ?? HADITH_PAGE_SIZE;
  const hadithTotal = hadithResults?.total ?? 0;
  const hadithTotalPages = Math.max(1, Math.ceil(hadithTotal / hadithPageSize));
  const showHadithPager =
    showHadith &&
    hadithTotalPages > 1 &&
    (scope === 'hadith' || (hadithResults?.items?.length ?? 0) > 0);

  const recentSuggestions = useMemo(
    () => buildRecentSuggestions(history, trimmedQuery),
    [history, trimmedQuery],
  );

  const dataSuggestions = useMemo(() => {
    const items: IslamicSearchSuggestion[] = [];
    if (scope === 'all' || scope === 'quran') {
      items.push(...buildPopularSurahSuggestions(language, trimmedQuery));
    }
    if (scope === 'all' || scope === 'adhkar') {
      items.push(
        ...buildFeaturedAdhkarSuggestions(language, key => t(key), trimmedQuery),
      );
    }
    if (scope === 'all' || scope === 'hadith') {
      items.push(...buildFeaturedHadithSuggestions(language, trimmedQuery));
    }
    return items.slice(0, 10);
  }, [language, scope, t, trimmedQuery]);

  const placeholder =
    scope === 'all'
      ? t('islamic.search.allPlaceholder')
      : scope === 'adhkar'
        ? t('islamic.search.adhkarPlaceholder')
        : scope === 'hadith'
          ? t('islamic.search.hadithPlaceholder')
          : quranMode === 'surah'
            ? t('islamic.search.surahPlaceholder')
            : quranMode === 'ayah'
              ? t('islamic.search.ayahPlaceholder')
              : t('islamic.search.textPlaceholder');

  const idleHint =
    scope === 'all'
      ? t('islamic.search.allHint')
      : scope === 'adhkar'
        ? t('islamic.search.adhkarHint')
        : scope === 'hadith'
          ? t('islamic.search.hadithHint')
          : quranMode === 'ayah'
            ? t('islamic.search.ayahHint')
            : quranMode === 'surah'
              ? t('islamic.search.surahHint')
              : t('islamic.search.textHint');

  const openResult = (item: SearchResult) => {
    add(trimmedQuery || item.title, scope);
    if (item.kind === 'quran') {
      navigation.navigate('QuranTafsirReader', {
        surahNumber: item.surahNumber,
        ayahNumber: item.ayahNumber,
      });
      return;
    }
    if (item.kind === 'adhkar') {
      navigation.navigate('AdhkarDetail', {
        categoryId: item.categoryId,
        title: item.title,
        itemId: item.itemId,
      });
      return;
    }
    navigation.navigate('HadithDetail', {
      hadithId: item.hadithId,
      title: item.title,
    });
  };

  const onSelectSuggestion = (suggestion: IslamicSearchSuggestion) => {
    add(suggestion.query, scope);
    if (suggestion.categoryId) {
      navigation.navigate('AdhkarDetail', {
        categoryId: suggestion.categoryId,
        title: suggestion.label,
      });
      return;
    }
    if (suggestion.surahNumber) {
      navigation.navigate('QuranTafsirReader', {
        surahNumber: suggestion.surahNumber,
        ayahNumber: 1,
      });
      return;
    }
    setQuery(suggestion.query);
  };

  const showIdle = trimmedQuery.length === 0;
  // Keep partial results visible while slower sources (hadith) finish.
  const showLoading =
    !showIdle && (isDebouncing || (isFetching && results.length === 0));
  const minCharsNotMet =
    !showIdle &&
    !isDebouncing &&
    results.length === 0 &&
    ((scope === 'hadith' && activeQuery.length < 2) ||
      (scope === 'adhkar' && activeQuery.length < 2) ||
      (scope === 'quran' && quranMode === 'text' && activeQuery.length < 2) ||
      (scope === 'all' &&
        activeQuery.length < 2 &&
        !ayahRef &&
        !(surahResults && surahResults.length > 0)));

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.search.title')} onBack={() => navigation.goBack()} />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        autoFocus
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <Spacer size="md" />
      <View style={styles.tabs}>
        {(['all', 'quran', 'adhkar', 'hadith'] as ScopeTab[]).map(item => (
          <Pressable
            key={item}
            style={[styles.tab, scope === item && styles.tabActive]}
            onPress={() => setScope(item)}>
            <TextView
              text={t(`islamic.search.scopes.${item}`)}
              variant="caption"
              style={scope === item ? {color: '#fff'} : undefined}
            />
          </Pressable>
        ))}
      </View>
      {scope === 'quran' ? (
        <View style={styles.tabs}>
          {(['surah', 'ayah', 'text'] as QuranSearchMode[]).map(item => (
            <Pressable
              key={item}
              style={[styles.tab, quranMode === item && styles.tabActive]}
              onPress={() => setQuranMode(item)}>
              <TextView
                text={t(`islamic.search.quranModes.${item}`)}
                variant="caption"
                style={quranMode === item ? {color: '#fff'} : undefined}
              />
            </Pressable>
          ))}
        </View>
      ) : null}

      {showIdle ? (
        <>
          <TextView text={idleHint} variant="body" muted />
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
              message={t('islamic.search.emptyMessage')}
            />
          ) : null}
        </>
      ) : showLoading ? (
        <IslamicLoadingState />
      ) : results.length === 0 &&
        ((hadithSearchEnabled && hadithError) ||
          (includeTextSearch && textError) ||
          (adhkarSearchEnabled && adhkarError)) &&
        !localFetching ? (
        <IslamicErrorState
          message={t('islamic.errors.loadFailed')}
          onRetry={() => {
            if (hadithSearchEnabled) {
              void refetchHadith();
            }
          }}
        />
      ) : minCharsNotMet ? (
        <EmptyView
          compact
          iconName="search-outline"
          title={t('islamic.search.keepTypingTitle')}
          message={t('islamic.search.keepTypingMessage')}
        />
      ) : (
        <>
          {isFetching && results.length > 0 ? (
            <TextView
              text={t('common.loading')}
              variant="caption"
              muted
              style={styles.fetchingHint}
            />
          ) : null}
          <FlashList
            data={results}
            style={styles.list}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <EmptyView
                compact
                iconName="file-tray-outline"
                title={t('islamic.search.noResults')}
                message={t('islamic.search.noResultsMessage')}
                actionLabel={t('islamic.search.trySuggestion')}
                onAction={() => setQuery('')}
              />
            }
            renderItem={({item}) => (
              <Pressable
                style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => openResult(item)}>
                <View style={styles.kind}>
                  <TextView text={t(`islamic.search.kinds.${item.kind}`)} variant="caption" />
                </View>
                <Heading text={item.title} level="h3" />
                <Spacer size="xs" />
                <TextView text={item.subtitle} variant="body" numberOfLines={3} muted />
              </Pressable>
            )}
          />
          {showHadithPager ? (
            <>
              <Spacer size="md" />
              <View style={styles.footer}>
                <Button
                  label={t('islamic.common.previous')}
                  variant="secondary"
                  onPress={() => setHadithPage(current => Math.max(1, current - 1))}
                  disabled={hadithPage <= 1 || hadithLoading}
                />
                <View style={styles.pageLabel}>
                  <TextView
                    text={`${hadithPage} / ${hadithTotalPages}`}
                    variant="caption"
                    muted
                  />
                </View>
                <Button
                  label={t('islamic.common.next')}
                  variant="primary"
                  onPress={() =>
                    setHadithPage(current => Math.min(hadithTotalPages, current + 1))
                  }
                  disabled={hadithPage >= hadithTotalPages || hadithLoading}
                />
              </View>
            </>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
};

export default IslamicUnifiedSearch;
