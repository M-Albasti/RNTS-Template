import React, {useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {quranClient} from '@api/clients/quranClient';
import {
  useAdhkarSearchQuery,
  useHadithSearchQuery,
  useQuranSearchQuery,
  useQuranSurahNameSearchQuery,
} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {QuranSearchMode} from '@Types/islamicTypes';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'IslamicUnifiedSearch'>};

type ScopeTab = 'all' | 'quran' | 'adhkar' | 'hadith';

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

  const trimmedQuery = query.trim();

  const showQuran = scope === 'all' || scope === 'quran';
  const showAdhkar = scope === 'all' || scope === 'adhkar';
  const showHadith = scope === 'all' || scope === 'hadith';

  const includeSurahSearch =
    showQuran && (scope === 'all' || quranMode === 'surah') && trimmedQuery.length >= 1;
  const includeTextSearch =
    showQuran && (scope === 'all' || quranMode === 'text') && trimmedQuery.length >= 2;
  const includeAyahSearch =
    showQuran && (scope === 'all' || quranMode === 'ayah') && trimmedQuery.length >= 1;
  const adhkarSearchEnabled = showAdhkar && trimmedQuery.length >= 1;
  const hadithSearchEnabled = showHadith && trimmedQuery.length >= 2;

  const ayahRef = useMemo(
    () => (includeAyahSearch ? quranClient.resolveAyahReference(trimmedQuery) : null),
    [includeAyahSearch, trimmedQuery],
  );

  const {data: surahResults, isFetching: surahLoading} = useQuranSurahNameSearchQuery(
    includeSurahSearch ? trimmedQuery : '',
  );
  const {data: textResults, isFetching: textLoading} = useQuranSearchQuery(
    includeTextSearch ? trimmedQuery : '',
    language === 'ar' ? 'ar' : 'en',
  );
  const {data: adhkarResults, isFetching: adhkarLoading} = useAdhkarSearchQuery(
    adhkarSearchEnabled ? trimmedQuery : '',
    language as 'ar' | 'en',
  );
  const {data: hadithResults, isFetching: hadithLoading, isError} = useHadithSearchQuery(
    hadithSearchEnabled ? trimmedQuery : '',
    'all',
    language,
  );

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    tabs: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs, marginBottom: tokens.spacing.sm},
    tab: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    tabActive: {backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary},
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    kind: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginBottom: tokens.spacing.xxs,
    },
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
          title: `${item.surah.englishName} ${item.numberInSurah}`,
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
          id: `adhkar-${item.id}`,
          title: item.title,
          subtitle: t('islamic.search.adhkarCategory'),
          categoryId: item.id,
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

  const isFetching =
    (includeSurahSearch && surahLoading) ||
    (includeTextSearch && textLoading) ||
    (adhkarSearchEnabled && adhkarLoading) ||
    (hadithSearchEnabled && hadithLoading);

  const placeholder =
    quranMode === 'surah'
      ? t('islamic.search.surahPlaceholder')
      : quranMode === 'ayah'
        ? t('islamic.search.ayahPlaceholder')
        : t('islamic.search.textPlaceholder');

  const openResult = (item: SearchResult) => {
    if (item.kind === 'quran') {
      navigation.navigate('QuranReader', {
        surahNumber: item.surahNumber,
        ayahNumber: item.ayahNumber,
      });
      return;
    }
    if (item.kind === 'adhkar') {
      navigation.navigate('AdhkarDetail', {
        categoryId: item.categoryId,
        title: item.title,
      });
      return;
    }
    navigation.navigate('HadithDetail', {
      hadithId: item.hadithId,
      title: item.title,
    });
  };

  const hint =
    quranMode === 'ayah'
      ? t('islamic.search.ayahHint')
      : quranMode === 'surah'
        ? t('islamic.search.surahHint')
        : t('islamic.search.textHint');

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.search.title')} onBack={() => navigation.goBack()} />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        autoFocus
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
      {(scope === 'all' || scope === 'quran') && (
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
      )}
      {!trimmedQuery ? (
        <TextView text={hint} variant="body" muted />
      ) : isFetching ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={results}
          style={styles.list}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <TextView text={t('islamic.search.noResults')} variant="body" muted />
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
      )}
    </ScreenContainer>
  );
};

export default IslamicUnifiedSearch;
