import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {ADHKAR_FEATURED_CATEGORY_IDS} from '@api/clients/adhkarClient';
import {useAdhkarCategoriesQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'AdhkarCategories'>};

const AdhkarCategories = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {data, isLoading, isError} = useAdhkarCategoriesQuery(lang);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    row: {
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
  }));

  const featured = useMemo(
    () => [
      {
        id: ADHKAR_FEATURED_CATEGORY_IDS.morningEvening,
        title: t('islamic.adhkar.morningEvening'),
        subtitle: t('islamic.adhkar.morningEveningSubtitle'),
        icon: 'sunny-outline',
      },
      {
        id: ADHKAR_FEATURED_CATEGORY_IDS.sleep,
        title: t('islamic.adhkar.sleep'),
        subtitle: t('islamic.adhkar.sleepSubtitle'),
        icon: 'moon-outline',
      },
      {
        id: ADHKAR_FEATURED_CATEGORY_IDS.afterPrayer,
        title: t('islamic.adhkar.afterPrayer'),
        subtitle: t('islamic.adhkar.afterPrayerSubtitle'),
        icon: 'hand-left-outline',
      },
      {
        id: ADHKAR_FEATURED_CATEGORY_IDS.travel,
        title: t('islamic.adhkar.travel'),
        subtitle: t('islamic.adhkar.travelSubtitle'),
        icon: 'airplane-outline',
      },
    ],
    [t],
  );

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={t('islamic.adhkar.title')} onBack={() => navigation.goBack()} />
      <Heading text={t('islamic.adhkar.featured')} level="h3" />
      <Spacer size="sm" />
      <View style={styles.grid}>
        {featured.map(item => (
          <FeatureHubCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            iconType="Ionicons"
            iconName={item.icon}
            onPress={() =>
              navigation.navigate('AdhkarDetail', {
                categoryId: item.id,
                title: item.title,
              })
            }
          />
        ))}
      </View>
      <Spacer size="lg" />
      <Heading text={t('islamic.adhkar.allCategories')} level="h3" />
      <Spacer size="sm" />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={data ?? []}
          style={styles.list}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                navigation.navigate('AdhkarDetail', {
                  categoryId: item.id,
                  title: item.title,
                })
              }>
              <Heading text={item.title} level="h3" />
              <TextView text={t('islamic.adhkar.openCategory')} variant="caption" muted />
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default AdhkarCategories;
