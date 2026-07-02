import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import type {HadithCollectionFilter} from '@api/clients/hadithClient';
import {useHadithEditionsQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'HadithEditions'>;
  route: AppRouteProp<'HadithEditions'>;
};

const HadithEditions = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const filter = route.params.filter as HadithCollectionFilter;
  const title = route.params.title;
  const {data, isLoading, isError} = useHadithEditionsQuery();

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
  }));

  const editions = useMemo(() => {
    if (!data) {
      return [];
    }
    if (filter === 'sahih') {
      return data.filter(item => item.category === 'sahih');
    }
    if (filter === 'weak') {
      return data.filter(item => item.category === 'sunan');
    }
    return data;
  }, [data, filter]);

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={editions}
          style={styles.list}
          keyExtractor={item => item.slug}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                navigation.navigate('HadithList', {
                  slug: item.slug,
                  title: item.name,
                  filter,
                })
              }>
              <Heading text={item.name} level="h3" />
              <TextView
                text={t('islamic.hadith.hadithCount', {count: item.hadithCount})}
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

export default HadithEditions;
