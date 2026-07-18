import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import TextInputView from '@atoms/TextInputView';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useQuranSearchQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'QuranSearch'>};

const QuranSearch = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const [query, setQuery] = useState('');
  const {data, isFetching, isError} = useQuranSearchQuery(query);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
  }));

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.quran.search')} onBack={() => navigation.goBack()} />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={t('islamic.quran.searchPlaceholder')}
        autoFocus
      />
      <Spacer size="md" />
      {query.trim().length < 2 ? (
        <TextView text={t('islamic.quran.searchHint')} variant="body" muted />
      ) : isFetching ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={data ?? []}
          style={styles.list}
          keyExtractor={item => `${item.surah.number}-${item.numberInSurah}`}
          ListEmptyComponent={
            <TextView text={t('islamic.quran.noResults')} variant="body" muted />
          }
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                navigation.navigate('QuranTafsirReader', {
                  surahNumber: item.surah.number,
                  ayahNumber: item.numberInSurah,
                })
              }>
              <Heading
                text={`${item.surah.englishName} ${item.numberInSurah}`}
                level="h3"
              />
              <Spacer size="xs" />
              <TextView text={item.text} variant="body" numberOfLines={3} />
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default QuranSearch;
