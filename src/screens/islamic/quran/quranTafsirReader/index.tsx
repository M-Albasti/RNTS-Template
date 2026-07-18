import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList, type FlashListRef} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {useQuranSurahQuery} from '@api/query/hooks/useIslamicQueries';
import QuranAudioBar from '@molecules/islamic/QuranAudioBar';
import {QURAN_RECITERS} from '@constants/quranReciters';
import {QURAN_TAFSIR_EDITIONS} from '@constants/quranTafsirEditions';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useQuranAudioPlayer} from '@hooks/useQuranAudioPlayer';
import {setLastReadPosition, updateQuranPreferences} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {QuranAyah} from '@Types/islamicTypes';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'QuranTafsirReader'>;
  route: AppRouteProp<'QuranTafsirReader'>;
};

/**
 * Surah ayah-by-ayah study reader with tafsir editions + translation.
 * Separate from the mushaf page reader (QuranReader).
 */
const QuranTafsirReader = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const {sizes} = useThemeTokens();
  const listRef = useRef<FlashListRef<QuranAyah>>(null);
  const surahNumber = route.params.surahNumber;
  const initialAyahNumber = route.params.ayahNumber ?? 1;
  const quranPreferences = useAppSelector(state => state.islamic.quranPreferences);
  const {reciterId, tafsirEditionId, showTafsir, showTranslation} = quranPreferences;

  const {data, isLoading, isError} = useQuranSurahQuery(
    surahNumber,
    tafsirEditionId,
    showTranslation,
  );

  const ayahs = useMemo(() => data?.ayahs ?? [], [data?.ayahs]);
  const [focusedAyahNumber, setFocusedAyahNumber] = useState(initialAyahNumber);

  const handleAyahChange = useCallback(
    (ayahNumber: number) => {
      setFocusedAyahNumber(ayahNumber);
      dispatch(setLastReadPosition({surahNumber, ayahNumber}));
    },
    [dispatch, surahNumber],
  );

  const handleSurahChange = useCallback(
    (nextSurah: number) => {
      // Keep the same screen mounted so continuous audio is not stopped by unmount.
      navigation.setParams({surahNumber: nextSurah, ayahNumber: 1});
      dispatch(setLastReadPosition({surahNumber: nextSurah, ayahNumber: 1}));
    },
    [dispatch, navigation],
  );

  const audio = useQuranAudioPlayer({
    surahNumber,
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
      backgroundColor: tokens.colors.primaryMuted,
      borderColor: tokens.colors.primary,
    },
    ayahWrap: {
      marginBottom: tokens.spacing.lg,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: 'transparent',
      backgroundColor: tokens.colors.surface,
    },
    ayahActive: {
      backgroundColor: tokens.colors.primaryMuted,
      borderColor: tokens.colors.primary,
      ...tokens.shadows.sm,
    },
    badge: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
    badgeActive: {backgroundColor: tokens.colors.primary},
    badgeTextActive: {color: tokens.colors.textInverse},
    arabic: {
      fontSize: tokens.typography.h2.fontSize,
      lineHeight: (tokens.typography.h2.lineHeight ?? 32) * 1.6,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
    tafsir: {
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
    headerMeta: {marginBottom: tokens.spacing.sm},
  }));

  useEffect(() => {
    if (!ayahs.length) {
      return;
    }
    const index = ayahs.findIndex(item => item.numberInSurah === initialAyahNumber);
    if (index >= 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({index, animated: true, viewOffset: 80});
      });
    }
    dispatch(setLastReadPosition({surahNumber, ayahNumber: initialAyahNumber}));
  }, [ayahs.length, dispatch, initialAyahNumber, surahNumber]);

  useEffect(() => {
    if (focusedAyahNumber !== audio.activeAyahNumber) {
      const index = ayahs.findIndex(item => item.numberInSurah === audio.activeAyahNumber);
      if (index >= 0) {
        listRef.current?.scrollToIndex({index, animated: true, viewOffset: 80});
      }
    }
  }, [audio.activeAyahNumber, ayahs, focusedAyahNumber]);

  const renderAyah = ({item}: {item: QuranAyah}) => {
    const isActive = item.numberInSurah === audio.activeAyahNumber && audio.hasLoadedTrack;
    return (
      <Pressable
        style={[styles.ayahWrap, isActive && styles.ayahActive]}
        onPress={() => {
          setFocusedAyahNumber(item.numberInSurah);
          dispatch(setLastReadPosition({surahNumber, ayahNumber: item.numberInSurah}));
          audio.playAyah(item.numberInSurah);
        }}>
        <View style={[styles.badge, isActive && styles.badgeActive]}>
          <TextView
            text={String(item.numberInSurah)}
            variant="caption"
            style={isActive ? styles.badgeTextActive : undefined}
          />
        </View>
        <Spacer size="xs" />
        <TextView text={item.text} variant="body" style={styles.arabic} />
        {showTranslation && item.translation ? (
          <>
            <Spacer size="sm" />
            <TextView text={item.translation} variant="bodySmall" muted />
          </>
        ) : null}
        {showTafsir && item.tafsir ? (
          <>
            <Spacer size="sm" />
            <TextView text={t('islamic.quran.tafsirLabel')} variant="caption" muted />
            <Spacer size="xxs" />
            <TextView text={item.tafsir} variant="bodySmall" style={styles.tafsir} />
          </>
        ) : null}
      </Pressable>
    );
  };

  return (
    <ScreenContainer bottomPadding="none" style={styles.body}>
      <ScreenHeader
        title={data?.name ?? t('islamic.quran.tafsirReaderTitle')}
        onBack={() => navigation.goBack()}
        rightAccessory={
          <TouchableIcon
            iconType="Ionicons"
            name="book-outline"
            size={sizes.iconSm}
            onPress={() =>
              navigation.navigate('QuranReader', {
                surahNumber,
                ayahNumber: focusedAyahNumber,
              })
            }
          />
        }
      />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <>
          <View style={styles.headerMeta}>
            <TextView
              text={`${data.englishName} · ${data.englishNameTranslation}`}
              variant="caption"
              muted
            />
            <Spacer size="xxs" />
            <TextView text={t('islamic.quran.tafsirReaderHint')} variant="caption" muted />
          </View>
          <View style={styles.toolbar}>
            <Pressable
              style={[styles.chip, showTafsir && styles.chipActive]}
              onPress={() => dispatch(updateQuranPreferences({showTafsir: !showTafsir}))}>
              <TextView text={t('islamic.quran.showTafsir')} variant="caption" />
            </Pressable>
            <Pressable
              style={[styles.chip, showTranslation && styles.chipActive]}
              onPress={() =>
                dispatch(updateQuranPreferences({showTranslation: !showTranslation}))
              }>
              <TextView text={t('islamic.quran.showTranslation')} variant="caption" />
            </Pressable>
            {QURAN_TAFSIR_EDITIONS.map(edition => (
              <Pressable
                key={edition.id}
                style={[styles.chip, tafsirEditionId === edition.id && styles.chipActive]}
                onPress={() => dispatch(updateQuranPreferences({tafsirEditionId: edition.id}))}>
                <TextView
                  text={i18n.language.startsWith('ar') ? edition.nameAr : edition.nameEn}
                  variant="caption"
                />
              </Pressable>
            ))}
          </View>
          <FlashList
            ref={listRef}
            data={ayahs}
            style={styles.body}
            keyExtractor={item => String(item.number)}
            renderItem={renderAyah}
          />
          <QuranAudioBar
            reciterId={reciterId}
            surahNumber={surahNumber}
            isPlaying={audio.isPlaying}
            isLoading={audio.isLoading}
            continuous
            onSelectReciter={id => dispatch(updateQuranPreferences({reciterId: id}))}
            onTogglePlay={audio.togglePlay}
            onPrevious={audio.playPrevious}
            onNext={audio.playNext}
            reciters={QURAN_RECITERS}
          />
        </>
      )}
    </ScreenContainer>
  );
};

export default QuranTafsirReader;
