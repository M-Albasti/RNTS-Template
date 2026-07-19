import React, {useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

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
  useQuranSearchQuery,
  useQuranSurahNameSearchQuery,
} from '@api/query/hooks/useIslamicQueries';
import {
  SEARCH_DEBOUNCE_MS,
  buildPopularSurahSuggestions,
  buildRecentSuggestions,
  normalizeSearchQuery,
  type IslamicSearchSuggestion,
} from '@helpers/islamicSearchHelpers';
import {useDebounce} from '@hooks/useInputDebounce';
import {useIslamicSearchHistory} from '@hooks/useIslamicSearchHistory';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'QuranSearch'>};

type QuranResult = {
  kind: 'ayah-ref' | 'surah' | 'text';
  id: string;
  title: string;
  subtitle: string;
  surahNumber: number;
  ayahNumber?: number;
};

const QuranSearch = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  const {history, add, clear, remove} = useIslamicSearchHistory();

  const trimmedQuery = normalizeSearchQuery(query);
  const debouncedQuery = normalizeSearchQuery(String(useDebounce(query, SEARCH_DEBOUNCE_MS)));
  const isDebouncing = trimmedQuery.length > 0 && trimmedQuery !== debouncedQuery;
  const activeQuery = isDebouncing ? '' : debouncedQuery;

  const ayahRef = useMemo(
    () => (activeQuery.length >= 1 ? quranClient.resolveAyahReference(activeQuery) : null),
    [activeQuery],
  );

  const textSearchEnabled = activeQuery.length >= 2;
  const {
    data: surahResults,
    isFetching: surahLoading,
    isError: surahError,
    refetch: refetchSurahs,
  } = useQuranSurahNameSearchQuery(activeQuery.length >= 1 ? activeQuery : '');
  const {
    data: textResults,
    isFetching: textLoading,
    isError: textError,
    refetch: refetchText,
    isFetched: textFetched,
  } = useQuranSearchQuery(textSearchEnabled ? activeQuery : '', language);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
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
    fetchingHint: {marginBottom: tokens.spacing.sm},
  }));

  const results = useMemo((): QuranResult[] => {
    const merged: QuranResult[] = [];

    if (ayahRef) {
      merged.push({
        kind: 'ayah-ref',
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

    if (surahResults?.length) {
      merged.push(
        ...surahResults.map(item => ({
          kind: 'surah' as const,
          id: `surah-${item.number}`,
          title: `${item.name} · ${item.englishName}`,
          subtitle: t('islamic.search.surahAyahs', {count: item.numberOfAyahs}),
          surahNumber: item.number,
        })),
      );
    }

    if (textResults?.length) {
      merged.push(
        ...textResults.map(item => ({
          kind: 'text' as const,
          id: `text-${item.surah.number}-${item.numberInSurah}`,
          title: `${item.surah.name || item.surah.englishName} ${item.numberInSurah}`,
          subtitle: item.text,
          surahNumber: item.surah.number,
          ayahNumber: item.numberInSurah,
        })),
      );
    }

    return merged;
  }, [ayahRef, surahResults, t, textResults]);

  const isFetching = surahLoading || textLoading;
  const showIdle = trimmedQuery.length === 0;
  const surahSearchEnabled = activeQuery.length >= 1;
  // Keep partial results visible while slower text search finishes.
  const showLoading =
    !showIdle && (isDebouncing || (isFetching && results.length === 0));
  // Hard error when every enabled search source failed (surah-only for 1-char queries).
  const hardError =
    !showIdle &&
    !isDebouncing &&
    results.length === 0 &&
    (surahSearchEnabled || textSearchEnabled) &&
    (!surahSearchEnabled || surahError) &&
    (!textSearchEnabled || textError);
  const minCharsNotMet =
    !showIdle && !isDebouncing && !textSearchEnabled && !ayahRef && !(surahResults?.length);

  const recentSuggestions = useMemo(
    () => buildRecentSuggestions(history, trimmedQuery),
    [history, trimmedQuery],
  );
  const dataSuggestions = useMemo(
    () => buildPopularSurahSuggestions(language, trimmedQuery).slice(0, 10),
    [language, trimmedQuery],
  );

  const openResult = (item: QuranResult) => {
    add(trimmedQuery || item.title, 'quran');
    navigation.navigate('QuranTafsirReader', {
      surahNumber: item.surahNumber,
      ayahNumber: item.ayahNumber,
    });
  };

  const onSelectSuggestion = (suggestion: IslamicSearchSuggestion) => {
    add(suggestion.query, 'quran');
    if (suggestion.surahNumber) {
      navigation.navigate('QuranTafsirReader', {
        surahNumber: suggestion.surahNumber,
        ayahNumber: 1,
      });
      return;
    }
    setQuery(suggestion.query);
  };

  const retrySearch = () => {
    if (activeQuery.length >= 1) {
      void refetchSurahs();
    }
    if (textSearchEnabled) {
      void refetchText();
    }
  };

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.quran.search')} onBack={() => navigation.goBack()} />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={t('islamic.quran.searchPlaceholder')}
        autoFocus
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <Spacer size="md" />
      {showIdle ? (
        <>
          <TextView text={t('islamic.quran.searchHint')} variant="body" muted />
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
              message={t('islamic.quran.searchHint')}
            />
          ) : null}
        </>
      ) : showLoading ? (
        <IslamicLoadingState />
      ) : hardError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} onRetry={retrySearch} />
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
                title={t('islamic.quran.noResults')}
                message={
                  textFetched || !textSearchEnabled
                    ? t('islamic.search.noResultsMessage')
                    : t('islamic.search.keepTypingMessage')
                }
                actionLabel={t('islamic.search.trySuggestion')}
                onAction={() => setQuery('')}
              />
            }
            renderItem={({item}) => (
              <Pressable
                style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => openResult(item)}>
                <View style={styles.kind}>
                  <TextView
                    text={
                      item.kind === 'surah'
                        ? t('islamic.search.quranModes.surah')
                        : t('islamic.search.quranModes.ayah')
                    }
                    variant="caption"
                  />
                </View>
                <Heading text={item.title} level="h3" />
                <Spacer size="xs" />
                <TextView text={item.subtitle} variant="body" numberOfLines={3} muted />
              </Pressable>
            )}
          />
        </>
      )}
    </ScreenContainer>
  );
};

export default QuranSearch;
