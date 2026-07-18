import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import type {HadithCollectionFilter} from '@api/clients/hadithClient';
import {useHadithSearchQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'HadithSearch'>};

const FILTERS: HadithCollectionFilter[] = ['all', 'sahih', 'weak'];

const HadithSearch = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HadithCollectionFilter>('all');
  const {data, isFetching, isError} = useHadithSearchQuery(query, filter, language);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    filters: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs, marginBottom: tokens.spacing.md},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    chipActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
  }));

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.hadith.search')} onBack={() => navigation.goBack()} />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={t('islamic.hadith.searchPlaceholder')}
        autoFocus
      />
      <Spacer size="md" />
      <View style={styles.filters}>
        {FILTERS.map(item => (
          <Pressable
            key={item}
            style={[styles.chip, filter === item && styles.chipActive]}
            onPress={() => setFilter(item)}>
            <TextView
              text={t(`islamic.hadith.filters.${item}`)}
              variant="caption"
              style={filter === item ? {color: '#fff'} : undefined}
            />
          </Pressable>
        ))}
      </View>
      {query.trim().length < 2 ? (
        <TextView text={t('islamic.hadith.searchHint')} variant="body" muted />
      ) : isFetching ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={data?.items ?? []}
          style={styles.list}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <TextView text={t('islamic.hadith.noResults')} variant="body" muted />
          }
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                navigation.navigate('HadithDetail', {
                  hadithId: item.id,
                  title: item.editionName,
                })
              }>
              <Heading text={item.editionName} level="h3" />
              <Spacer size="xs" />
              <TextView text={item.text} variant="body" numberOfLines={4} />
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default HadithSearch;
