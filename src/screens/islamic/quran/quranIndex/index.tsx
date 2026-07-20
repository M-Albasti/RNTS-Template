import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';

import {quranClient} from '@api/clients/quranClient';
import {useQuranJuzListQuery, useQuranSurahsQuery} from '@api/query/hooks/useIslamicQueries';
import {arabicScriptFonts} from '@theme/fonts';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'QuranIndex'>};
type IndexTab = 'surah' | 'juz';

const QuranIndex = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<IndexTab>('surah');
  const {data: surahs, isLoading: surahsLoading, isError: surahsError} = useQuranSurahsQuery();
  const {data: juzList, isLoading: juzLoading, isError: juzError} = useQuranJuzListQuery();

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    tabs: {...tokens.layout.presets.row, gap: tokens.spacing.sm, marginBottom: tokens.spacing.md},
    tab: {
      flex: tokens.layout.flex.fill,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.radius.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
      alignItems: 'center' as const,
    },
    tabActive: {backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary},
    tabActiveText: {color: tokens.colors.textInverse},
    row: {
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.xxs,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    meta: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: tokens.spacing.md,
      direction: 'ltr' as const,
    },
    numberBadge: {
      width: tokens.sizes.touchTarget,
      height: tokens.sizes.touchTarget,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primaryMuted,
      ...tokens.layout.presets.center,
      flexShrink: 0,
    },
    copy: {
      flex: 1,
      minWidth: 0,
      gap: tokens.spacing.xxs,
      justifyContent: 'center' as const,
    },
    arabicName: {
      fontFamily: arabicScriptFonts.regular,
      fontWeight: 'normal' as const,
      fontSize: tokens.typography.h3.fontSize ?? 18,
      lineHeight: Math.round((tokens.typography.h3.fontSize ?? 18) * 1.65),
      color: tokens.colors.textPrimary,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
      includeFontPadding: false,
      width: '100%' as const,
    },
    englishMeta: {
      textAlign: 'right' as const,
    },
  }));

  const openJuz = async (juzNumber: number) => {
    const target = await quranClient.getJuzReading(juzNumber);
    if (target) {
      navigation.navigate('QuranReader', target);
    }
  };

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.quran.index')} navigation={navigation} />
      <View style={styles.tabs}>
        {(['surah', 'juz'] as IndexTab[]).map(item => (
          <Pressable
            key={item}
            style={[styles.tab, tab === item && styles.tabActive]}
            onPress={() => setTab(item)}>
            <TextView
              text={t(`islamic.quran.indexTabs.${item}`)}
              variant="bodySmall"
              style={tab === item ? styles.tabActiveText : undefined}
            />
          </Pressable>
        ))}
      </View>

      {tab === 'surah' ? (
        surahsLoading ? (
          <IslamicLoadingState />
        ) : surahsError ? (
          <IslamicErrorState message={t('islamic.errors.loadFailed')} />
        ) : (
          <FlashList
            data={surahs ?? []}
            style={styles.list}
            keyExtractor={item => String(item.number)}
            renderItem={({item}) => (
              <Pressable
                style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => navigation.navigate('QuranReader', {surahNumber: item.number})}>
                <View style={styles.meta}>
                  <View style={styles.copy}>
                    <Text style={styles.arabicName}>{item.name}</Text>
                    <TextView
                      text={`${item.englishName} · ${item.numberOfAyahs}`}
                      variant="caption"
                      muted
                      style={styles.englishMeta}
                    />
                  </View>
                  <View style={styles.numberBadge}>
                    <Heading text={String(item.number)} level="h3" />
                  </View>
                </View>
              </Pressable>
            )}
          />
        )
      ) : juzLoading ? (
        <IslamicLoadingState />
      ) : juzError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={juzList ?? []}
          style={styles.list}
          keyExtractor={item => String(item.number)}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => openJuz(item.number)}>
              <Heading text={t('islamic.quran.juzTitle', {number: item.number})} level="h3" />
              <TextView text={item.firstAyahRef} variant="caption" muted />
              <TextView
                text={t('islamic.quran.juzAyahCount', {count: item.ayahCount})}
                variant="caption"
                muted
              />
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default QuranIndex;
