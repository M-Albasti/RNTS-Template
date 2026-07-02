import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {quranClient} from '@api/clients/quranClient';
import {useQuranJuzListQuery, useQuranSurahsQuery} from '@api/query/hooks/useIslamicQueries';
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
      alignItems: 'center' as const,
    },
    tabActive: {backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary},
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    meta: {...tokens.layout.presets.row, gap: tokens.spacing.md, alignItems: 'center' as const},
  }));

  const openJuz = async (juzNumber: number) => {
    const target = await quranClient.getJuzReading(juzNumber);
    if (target) {
      navigation.navigate('QuranReader', target);
    }
  };

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.quran.index')} onBack={() => navigation.goBack()} />
      <View style={styles.tabs}>
        {(['surah', 'juz'] as IndexTab[]).map(item => (
          <Pressable
            key={item}
            style={[styles.tab, tab === item && styles.tabActive]}
            onPress={() => setTab(item)}>
            <TextView
              text={t(`islamic.quran.indexTabs.${item}`)}
              variant="bodySmall"
              style={tab === item ? {color: '#fff'} : undefined}
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
                  <Heading text={String(item.number)} level="h3" />
                  <View>
                    <Heading text={item.name} level="h3" />
                    <TextView
                      text={`${item.englishName} · ${item.numberOfAyahs}`}
                      variant="caption"
                      muted
                    />
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
