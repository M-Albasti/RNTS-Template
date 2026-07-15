import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import EmptyView from '@atoms/EmptyView';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import type {HadithCollectionFilter} from '@api/clients/hadithClient';
import {isWeakHadith} from '@api/mappers/islamic.mapper';
import {useHadithListQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'HadithList'>;
  route: AppRouteProp<'HadithList'>;
};

const HadithList = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {slug, title, filter = 'all'} = route.params;
  const [page, setPage] = useState(1);
  const {data, isLoading, isError, isFetching} = useHadithListQuery(slug, page, language);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    grade: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.warningMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginTop: tokens.spacing.xs,
    },
    footer: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
  }));

  const items =
    filter === 'weak'
      ? (data?.items ?? []).filter(item => isWeakHadith(item.grades))
      : data?.items ?? [];

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <>
          <FlashList
            data={items}
            style={styles.list}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <EmptyView compact title={t('islamic.hadith.noResults')} iconName="book-outline" />
            }
            renderItem={({item}) => (
              <Pressable
                style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
                onPress={() =>
                  navigation.navigate('HadithDetail', {hadithId: item.id, title: item.editionName})
                }>
                <Heading text={`#${item.hadithIndex}`} level="h3" />
                <Spacer size="xs" />
                <TextView text={item.text} variant="body" numberOfLines={4} />
                {item.grades[0] ? (
                  <View style={styles.grade}>
                    <TextView text={item.grades[0].grade} variant="caption" />
                  </View>
                ) : null}
              </Pressable>
            )}
          />
          <Spacer size="md" />
          <View style={styles.footer}>
            <Button
              label={t('islamic.common.previous')}
              variant="secondary"
              onPress={() => setPage(current => Math.max(1, current - 1))}
              disabled={page <= 1 || isFetching}
            />
            <Button
              label={t('islamic.common.next')}
              variant="primary"
              onPress={() => setPage(current => current + 1)}
              disabled={isFetching || items.length === 0}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
};

export default HadithList;
