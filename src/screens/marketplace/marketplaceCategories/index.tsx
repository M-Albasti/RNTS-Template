import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {MARKETPLACE_CATEGORIES} from '@constants/marketplaceMockData';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMarketplaceCategoriesStyles} from './styles/resolveMarketplaceCategoriesStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceCategories'>};

const MarketplaceCategories = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveMarketplaceCategoriesStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.categoriesTitle')} onBack={() => navigation.goBack()} />
      <View style={styles.grid}>
        {MARKETPLACE_CATEGORIES.map(category => (
          <Pressable
            key={category.id}
            style={[styles.chip, {backgroundColor: `${category.color}18`}]}
            onPress={() =>
              navigation.navigate('MarketplaceProducts', {categoryId: category.id})
            }>
            <TextView text={category.icon} variant="h3" />
            <TextView text={t(category.nameKey)} variant="bodySmall" align="center" />
          </Pressable>
        ))}
      </View>
      <Spacer size="md" />
    </ScreenContainer>
  );
};

export default MarketplaceCategories;
