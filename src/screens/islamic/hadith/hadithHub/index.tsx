import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'HadithHub'>};

const HadithHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
    },
    heroText: {color: tokens.colors.textInverse},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('islamic.hadith.title')} onBack={() => navigation.goBack()} />
      <View style={styles.hero}>
        <TextView text={t('islamic.hadith.subtitle')} variant="bodySmall" style={styles.heroText} />
        <Spacer size="xs" />
        <Heading text={t('islamic.hadith.hubTitle')} level="h2" align="center" />
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('islamic.hadith.sahih')}
          subtitle={t('islamic.hadith.sahihSubtitle')}
          iconType="Ionicons"
          iconName="shield-checkmark-outline"
          onPress={() =>
            navigation.navigate('HadithEditions', {filter: 'sahih', title: t('islamic.hadith.sahih')})
          }
        />
        <FeatureHubCard
          title={t('islamic.hadith.weak')}
          subtitle={t('islamic.hadith.weakSubtitle')}
          iconType="Ionicons"
          iconName="alert-circle-outline"
          onPress={() =>
            navigation.navigate('HadithEditions', {filter: 'weak', title: t('islamic.hadith.weak')})
          }
        />
        <FeatureHubCard
          title={t('islamic.hadith.allCollections')}
          subtitle={t('islamic.hadith.allCollectionsSubtitle')}
          iconType="Ionicons"
          iconName="library-outline"
          onPress={() =>
            navigation.navigate('HadithEditions', {
              filter: 'all',
              title: t('islamic.hadith.allCollections'),
            })
          }
        />
        <FeatureHubCard
          title={t('islamic.hadith.search')}
          subtitle={t('islamic.hadith.searchSubtitle')}
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('HadithSearch')}
        />
      </View>
    </ScreenContainer>
  );
};

export default HadithHub;
