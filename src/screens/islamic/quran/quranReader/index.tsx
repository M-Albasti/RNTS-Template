import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {quranClient} from '@api/clients/quranClient';
import {
  useQuranMushafPageQuery,
  useQuranPageForAyahQuery,
  useQuranSurahQuery,
} from '@api/query/hooks/useIslamicQueries';
import QuranAudioBar from '@molecules/islamic/QuranAudioBar';
import {MUSHAF_PAGE_COUNT, QURAN_RECITERS} from '@constants/quranReciters';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useQuranAudioPlayer} from '@hooks/useQuranAudioPlayer';
import {setLastReadPosition, updateQuranPreferences} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'QuranReader'>;
  route: AppRouteProp<'QuranReader'>;
};

const QuranReader = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const {sizes} = useThemeTokens();
  const isAr = i18n.language.startsWith('ar');
  const surahNumber = route.params.surahNumber;
  const initialAyahNumber = route.params.ayahNumber ?? 1;
  const quranPreferences = useAppSelector(state => state.islamic.quranPreferences);
  const {reciterId, showTranslation} = quranPreferences;
  const [viewMode, setViewMode] = useState<'mushaf' | 'ayah'>('mushaf');
  const [pageNumber, setPageNumber] = useState(1);

  const {data: resolvedPage} = useQuranPageForAyahQuery(surahNumber, initialAyahNumber);
  const mushafQuery = useQuranMushafPageQuery(pageNumber);
  const surahQuery = useQuranSurahQuery(surahNumber, quranPreferences.tafsirEditionId, showTranslation);

  useEffect(() => {
    if (resolvedPage) {
      setPageNumber(resolvedPage);
    }
  }, [resolvedPage]);

  const pageSurahNumber = mushafQuery.data?.ayahs[0]?.surahNumber ?? surahNumber;

  const handleAyahChange = useCallback(
    (ayahNumber: number) => {
      dispatch(setLastReadPosition({surahNumber: pageSurahNumber, ayahNumber}));
    },
    [dispatch, pageSurahNumber],
  );

  const handleSurahChange = useCallback(
    async (nextSurah: number) => {
      dispatch(setLastReadPosition({surahNumber: nextSurah, ayahNumber: 1}));
      try {
        const page = await quranClient.getPageForAyah(nextSurah, 1);
        setPageNumber(page);
      } catch {
        // keep current page if lookup fails
      }
    },
    [dispatch],
  );

  const audio = useQuranAudioPlayer({
    surahNumber: pageSurahNumber,
    reciterId,
    initialAyahNumber,
    onAyahChange: handleAyahChange,
    onSurahChange: handleSurahChange,
  });

  const styles = useThemedStyles(tokens => ({
    body: {flex: tokens.layout.flex.fill},
    toolbar: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.xs,
      marginBottom: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.sm,
    },
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      backgroundColor: tokens.colors.surface,
    },
    chipActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    chipTextActive: {color: tokens.colors.textInverse},
    pageNav: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    mushafSheet: {
      flex: tokens.layout.flex.fill,
      marginHorizontal: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
      borderRadius: tokens.radius.lg,
      backgroundColor: '#F7F0E2',
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: '#D4C4A8',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.lg,
      ...tokens.shadows.md,
    },
    mushafHeader: {
      ...tokens.layout.presets.rowBetween,
      marginBottom: tokens.spacing.md,
      paddingBottom: tokens.spacing.sm,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: '#D4C4A8',
    },
    mushafHeaderText: {color: '#5C4A32'},
    mushafBody: {
      flexGrow: 1,
      justifyContent: 'center' as const,
    },
    mushafText: {
      fontSize: 26,
      lineHeight: 48,
      textAlign: 'center' as const,
      writingDirection: 'rtl' as const,
      color: '#1A1208',
      fontWeight: '500' as const,
    },
    ayahNumber: {
      fontSize: 14,
      color: '#8B6914',
    },
    pageFooter: {
      marginTop: tokens.spacing.md,
      paddingTop: tokens.spacing.sm,
      borderTopWidth: tokens.layout.borderWidth.sm,
      borderTopColor: '#D4C4A8',
      alignItems: 'center' as const,
    },
    ayahWrap: {
      marginBottom: tokens.spacing.md,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.lg,
      backgroundColor: tokens.colors.surface,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    arabic: {
      fontSize: tokens.typography.h2.fontSize,
      lineHeight: (tokens.typography.h2.lineHeight ?? 32) * 1.6,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
  }));

  const mushafText = useMemo(() => {
    if (!mushafQuery.data?.ayahs?.length) {
      return '';
    }
    return mushafQuery.data.ayahs
      .map(ayah => `${ayah.text} ﴿${ayah.numberInSurah}﴾`)
      .join(' ');
  }, [mushafQuery.data?.ayahs]);

  const pageMeta = mushafQuery.data?.ayahs[0];
  const isLoading = viewMode === 'mushaf' ? mushafQuery.isLoading : surahQuery.isLoading;
  const isError = viewMode === 'mushaf' ? mushafQuery.isError : surahQuery.isError;

  useEffect(() => {
    dispatch(setLastReadPosition({surahNumber, ayahNumber: initialAyahNumber}));
  }, [dispatch, initialAyahNumber, surahNumber]);

  const goPage = (delta: number) => {
    setPageNumber(current => Math.min(MUSHAF_PAGE_COUNT, Math.max(1, current + delta)));
  };

  return (
    <ScreenContainer bottomPadding="none" style={styles.body}>
      <ScreenHeader
        title={
          viewMode === 'mushaf'
            ? t('islamic.quran.mushafTitle', {page: pageNumber})
            : surahQuery.data?.name ?? t('islamic.quran.title')
        }
        onBack={() => navigation.goBack()}
        rightAccessory={
          <TouchableIcon
            iconType="Ionicons"
            name="search-outline"
            size={sizes.iconSm}
            onPress={() => navigation.navigate('IslamicUnifiedSearch')}
          />
        }
      />

      <View style={styles.toolbar}>
        <Pressable
          style={[styles.chip, viewMode === 'mushaf' && styles.chipActive]}
          onPress={() => setViewMode('mushaf')}>
          <TextView
            text={t('islamic.quran.mushafMode')}
            variant="caption"
            style={viewMode === 'mushaf' ? styles.chipTextActive : undefined}
          />
        </Pressable>
        <Pressable
          style={[styles.chip, viewMode === 'ayah' && styles.chipActive]}
          onPress={() => setViewMode('ayah')}>
          <TextView
            text={t('islamic.quran.ayahMode')}
            variant="caption"
            style={viewMode === 'ayah' ? styles.chipTextActive : undefined}
          />
        </Pressable>
        <Pressable
          style={[styles.chip, showTranslation && styles.chipActive]}
          onPress={() =>
            dispatch(updateQuranPreferences({showTranslation: !showTranslation}))
          }>
          <TextView
            text={t('islamic.quran.showTranslation')}
            variant="caption"
            style={showTranslation ? styles.chipTextActive : undefined}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : viewMode === 'mushaf' ? (
        <>
          <View style={styles.pageNav}>
            <TouchableIcon
              iconType="Ionicons"
              name={isAr ? 'chevron-forward' : 'chevron-back'}
              size={sizes.iconSm}
              onPress={() => goPage(isAr ? 1 : -1)}
            />
            <TextView
              text={t('islamic.quran.pageOf', {page: pageNumber, total: MUSHAF_PAGE_COUNT})}
              variant="caption"
              muted
            />
            <TouchableIcon
              iconType="Ionicons"
              name={isAr ? 'chevron-back' : 'chevron-forward'}
              size={sizes.iconSm}
              onPress={() => goPage(isAr ? -1 : 1)}
            />
          </View>
          <View style={styles.mushafSheet}>
            <View style={styles.mushafHeader}>
              <TextView
                text={pageMeta?.surahName ?? ''}
                variant="caption"
                style={styles.mushafHeaderText}
              />
              <TextView
                text={t('islamic.quran.juz', {n: pageMeta?.juz ?? 1})}
                variant="caption"
                style={styles.mushafHeaderText}
              />
            </View>
            <ScrollView contentContainerStyle={styles.mushafBody}>
              <TextView text={mushafText} style={styles.mushafText} />
            </ScrollView>
            <View style={styles.pageFooter}>
              <TextView
                text={String(pageNumber)}
                variant="caption"
                style={styles.mushafHeaderText}
              />
            </View>
          </View>
        </>
      ) : (
        <ScrollView style={styles.body} contentContainerStyle={{paddingHorizontal: 16}}>
          <Heading
            text={surahQuery.data?.name ?? ''}
            level="h2"
            align="center"
          />
          <TextView
            text={`${surahQuery.data?.englishName} · ${surahQuery.data?.numberOfAyahs} ${t('islamic.quran.ayahs')}`}
            variant="caption"
            muted
            align="center"
          />
          <Spacer size="md" />
          {(surahQuery.data?.ayahs ?? []).map(item => (
            <Pressable
              key={item.number}
              style={styles.ayahWrap}
              onPress={() => audio.playAyah(item.numberInSurah)}>
              <TextView text={item.text} variant="body" style={styles.arabic} />
              {showTranslation && item.translation ? (
                <>
                  <Spacer size="sm" />
                  <TextView text={item.translation} variant="bodySmall" muted />
                </>
              ) : null}
            </Pressable>
          ))}
          <Spacer size="xxl" />
        </ScrollView>
      )}

      <QuranAudioBar
        reciterId={reciterId}
        surahNumber={pageSurahNumber}
        isPlaying={audio.isPlaying}
        isLoading={audio.isLoading}
        continuous
        onSelectReciter={id => dispatch(updateQuranPreferences({reciterId: id}))}
        onTogglePlay={audio.togglePlay}
        onPrevious={audio.playPrevious}
        onNext={audio.playNext}
        reciters={QURAN_RECITERS}
      />
    </ScreenContainer>
  );
};

export default QuranReader;
