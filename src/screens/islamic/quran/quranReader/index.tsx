import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {quranClient} from '@api/clients/quranClient';
import {
  useQuranAyahTimingQuery,
  useQuranMushafPageQuery,
  useQuranPageForAyahQuery,
  useQuranSurahAyahPagesQuery,
} from '@api/query/hooks/useIslamicQueries';
import MushafPageSheet from '@molecules/islamic/MushafPageSheet';
import QuranAudioBar from '@molecules/islamic/QuranAudioBar';
import {
  getTimingReadId,
  MUSHAF_PAGE_COUNT,
  QURAN_RECITERS,
} from '@constants/quranReciters';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useQuranAudioPlayer} from '@hooks/useQuranAudioPlayer';
import {setLastReadPosition, updateQuranPreferences} from '@redux/slices/islamicSlice';
import {quranAudioController} from '@services/quranAudioService/quranAudioController';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {MushafPageAyah} from '@helpers/mushafPageHelpers';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'QuranReader'>;
  route: AppRouteProp<'QuranReader'>;
};

/**
 * Madinah mushaf page reader + continuous surah audio.
 * Highlight uses mp3quran ayat_timing for the *playing* surah.
 */
const QuranReader = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const {sizes} = useThemeTokens();
  const isAr = i18n.language.startsWith('ar');
  const viewedSurahNumber = route.params.surahNumber;
  const initialAyahNumber = route.params.ayahNumber ?? 1;
  const reciterId = useAppSelector(state => state.islamic.quranPreferences.reciterId);
  const timingReadId = getTimingReadId(reciterId);
  const [pageNumber, setPageNumber] = useState(1);

  const {data: resolvedPage} = useQuranPageForAyahQuery(
    viewedSurahNumber,
    initialAyahNumber,
  );
  const mushafQuery = useQuranMushafPageQuery(pageNumber);
  const ayahTimingQuery = useQuranAyahTimingQuery(viewedSurahNumber, timingReadId);
  const ayahPagesQuery = useQuranSurahAyahPagesQuery(
    viewedSurahNumber,
    timingReadId == null,
  );

  useEffect(() => {
    if (resolvedPage) {
      setPageNumber(resolvedPage);
    }
  }, [resolvedPage]);

  const pageSurahNumber = mushafQuery.data?.ayahs[0]?.surahNumber ?? viewedSurahNumber;

  const handleAyahChange = useCallback(
    (playingSurah: number, ayahNumber: number) => {
      dispatch(setLastReadPosition({surahNumber: playingSurah, ayahNumber}));
    },
    [dispatch],
  );

  const handlePageChange = useCallback((nextPage: number) => {
    setPageNumber(current => (current === nextPage ? current : nextPage));
  }, []);

  const handleSurahChange = useCallback(
    async (nextSurah: number) => {
      // Keep route in sync with continuous playback so highlight gating
      // (`isViewingPlayingSurah`) stays true across surah boundaries.
      navigation.setParams({surahNumber: nextSurah, ayahNumber: 1});
      dispatch(setLastReadPosition({surahNumber: nextSurah, ayahNumber: 1}));
      try {
        const page = await quranClient.getPageForAyah(nextSurah, 1);
        setPageNumber(page);
      } catch {
        // keep current page
      }
    },
    [dispatch, navigation],
  );

  const audio = useQuranAudioPlayer({
    surahNumber: viewedSurahNumber,
    reciterId,
    initialAyahNumber,
    ayahTimings: ayahTimingQuery.data,
    ayahPageMap: ayahPagesQuery.data,
    onAyahChange: handleAyahChange,
    onPageChange: handlePageChange,
    onSurahChange: handleSurahChange,
  });

  const styles = useThemedStyles(tokens => ({
    body: {flex: tokens.layout.flex.fill},
    pageNav: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
  }));

  const pageAyahs = mushafQuery.data?.ayahs ?? [];

  useEffect(() => {
    // Don't overwrite last-read of the playing surah while browsing another.
    if (audio.isPlaying || audio.isLoading || audio.hasLoadedTrack) {
      return;
    }
    dispatch(
      setLastReadPosition({
        surahNumber: viewedSurahNumber,
        ayahNumber: initialAyahNumber,
      }),
    );
  }, [
    audio.hasLoadedTrack,
    audio.isLoading,
    audio.isPlaying,
    dispatch,
    initialAyahNumber,
    viewedSurahNumber,
  ]);

  const goPage = (delta: number) => {
    setPageNumber(current => Math.min(MUSHAF_PAGE_COUNT, Math.max(1, current + delta)));
  };

  const handleAyahPress = useCallback(
    (ayah: MushafPageAyah) => {
      dispatch(
        setLastReadPosition({
          surahNumber: ayah.surahNumber,
          ayahNumber: ayah.numberInSurah,
        }),
      );
      quranAudioController.playAyah(ayah.numberInSurah, ayah.surahNumber, reciterId);
    },
    [dispatch, reciterId],
  );

  // Prefer route match; also allow highlight when the open mushaf page
  // already contains the playing ayah (surah auto-advance race).
  const pageHasPlayingAyah = pageAyahs.some(
    ayah =>
      ayah.surahNumber === audio.playingSurahNumber &&
      ayah.numberInSurah === audio.activeAyahNumber,
  );
  const showHighlight =
    (audio.hasLoadedTrack || audio.isPlaying || audio.isLoading) &&
    audio.activeAyahNumber > 0 &&
    (audio.isViewingPlayingSurah || pageHasPlayingAyah);

  return (
    <ScreenContainer bottomPadding="none" style={styles.body}>
      <ScreenHeader
        title={t('islamic.quran.mushafTitle', {page: pageNumber})}
        onBack={() => navigation.goBack()}
        rightAccessory={
          <TouchableIcon
            iconType="Ionicons"
            name="document-text-outline"
            size={sizes.iconSm}
            onPress={() =>
              navigation.navigate('QuranTafsirReader', {
                surahNumber: pageSurahNumber,
                ayahNumber: 1,
              })
            }
          />
        }
      />

      {mushafQuery.isLoading ? (
        <IslamicLoadingState />
      ) : mushafQuery.isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
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
          <TextView
            text={t('islamic.quran.tapAyahHint')}
            variant="caption"
            muted
            style={styles.pageNav}
          />
          <MushafPageSheet
            pageNumber={pageNumber}
            ayahs={pageAyahs}
            audioSurahNumber={audio.playingSurahNumber}
            activeAyahNumber={audio.activeAyahNumber}
            showAyahHighlight={showHighlight}
            onAyahPress={handleAyahPress}
          />
        </>
      )}

      <QuranAudioBar
        reciterId={reciterId}
        surahNumber={audio.playingSurahNumber}
        activeAyahNumber={audio.activeAyahNumber}
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
