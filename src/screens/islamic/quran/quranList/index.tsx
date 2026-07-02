import React from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useQuranSurahsQuery} from '@api/query/hooks/useIslamicQueries';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setLastReadSurah} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'QuranList'>};

const QuranList = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {data, isLoading, isError} = useQuranSurahsQuery();

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    search: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
    },
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    meta: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
  }));

  const filtered = data ?? [];

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.quran.title')} onBack={() => navigation.goBack()} />
      <Pressable style={styles.search} onPress={() => navigation.navigate('QuranSearch')}>
        <TextView text={t('islamic.quran.searchPlaceholder')} variant="body" muted />
      </Pressable>
      <Spacer size="md" />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={filtered}
          style={styles.list}
          keyExtractor={item => String(item.number)}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => {
                dispatch(setLastReadSurah(item.number));
                navigation.navigate('QuranReader', {surahNumber: item.number});
              }}>
              <View style={styles.meta}>
                <Heading text={String(item.number)} level="h3" />
                <View>
                  <Heading text={item.name} level="h3" />
                  <TextView
                    text={`${item.englishName} · ${item.numberOfAyahs} ${t('islamic.quran.ayahs')}`}
                    variant="caption"
                    muted
                  />
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default QuranList;
