import React, {useMemo, useState} from 'react';
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
    footer: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      gap: tokens.spacing.sm,
      paddingTop: tokens.spacing.sm,
    },
    pageLabel: {flex: 1, alignItems: 'center' as const},
  }));

  const pageSize = data?.pageSize ?? 20;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const items = useMemo(() => {
    const source = data?.items ?? [];
    if (filter !== 'weak') {
      return source;
    }
    return source.filter(item => isWeakHadith(item.grades));
  }, [data?.items, filter]);

  const canGoNext = page < totalPages && !isFetching;
  const canGoPrev = page > 1 && !isFetching;

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <>
          <TextView
            text={t('islamic.hadith.pageInfo', {page, totalPages, total})}
            variant="caption"
            muted
          />
          <Spacer size="sm" />
          <FlashList
            data={items}
            style={styles.list}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <EmptyView
                compact
                title={
                  filter === 'weak' && (data?.items?.length ?? 0) > 0
                    ? t('islamic.hadith.noWeakOnPage')
                    : t('islamic.hadith.noResults')
                }
                iconName="book-outline"
              />
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
              disabled={!canGoPrev}
            />
            <View style={styles.pageLabel}>
              <TextView text={`${page} / ${totalPages}`} variant="caption" muted />
            </View>
            <Button
              label={t('islamic.common.next')}
              variant="primary"
              onPress={() => setPage(current => Math.min(totalPages, current + 1))}
              disabled={!canGoNext}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
};

export default HadithList;
