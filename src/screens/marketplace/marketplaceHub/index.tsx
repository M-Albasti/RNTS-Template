import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {MARKETPLACE_CATEGORIES} from '@constants/marketplaceMockData';
import {getCartItemCount} from '@helpers/marketplaceHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMarketplaceHubStyles} from './styles/resolveMarketplaceHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceHub'>};

const MarketplaceHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const cartCount = useAppSelector(state => getCartItemCount(state.marketplace.cart));

  const styles = useThemedStyles(resolveMarketplaceHubStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.title')} showBack={false} />
      <View style={styles.hero}>
        <Heading text={t('marketplace.hubTitle')} level="h2" />
        <Spacer size="xs" />
        <TextView text={t('marketplace.hubSubtitle')} muted />
        <Spacer size="sm" />
        <Pressable onPress={() => navigation.navigate('MarketplaceSearch')}>
          <TextView text={t('marketplace.searchPlaceholder')} muted />
        </Pressable>
      </View>
      <Spacer size="lg" />
      <Heading text={t('marketplace.categoriesTitle')} level="h3" />
      <Spacer size="sm" />
      <View style={styles.categories}>
        {MARKETPLACE_CATEGORIES.slice(0, 6).map(category => (
          <Pressable
            key={category.id}
            style={[styles.categoryChip, {backgroundColor: `${category.color}22`}]}
            onPress={() =>
              navigation.navigate('MarketplaceProducts', {categoryId: category.id})
            }>
            <TextView text={category.icon} variant="h3" />
            <TextView text={t(category.nameKey)} variant="caption" align="center" />
          </Pressable>
        ))}
      </View>
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('marketplace.browseAll')}
          subtitle={t('marketplace.browseAllSubtitle')}
          iconType="Ionicons"
          iconName="grid-outline"
          onPress={() => navigation.navigate('MarketplaceCategories')}
        />
        <FeatureHubCard
          title={t('marketplace.cart')}
          subtitle={t('marketplace.cartSubtitle', {count: cartCount})}
          iconType="Ionicons"
          iconName="cart-outline"
          onPress={() => navigation.navigate('MarketplaceCart')}
        />
        <FeatureHubCard
          title={t('marketplace.myOrders')}
          subtitle={t('marketplace.myOrdersSubtitle')}
          iconType="Ionicons"
          iconName="receipt-outline"
          onPress={() => navigation.navigate('MarketplaceOrders')}
        />
        <FeatureHubCard
          title={t('marketplace.sellItem')}
          subtitle={t('marketplace.sellItemSubtitle')}
          iconType="Ionicons"
          iconName="pricetag-outline"
          onPress={() => navigation.navigate('MarketplaceSell')}
        />
        <FeatureHubCard
          title={t('marketplace.myListings')}
          subtitle={t('marketplace.myListingsSubtitle')}
          iconType="Ionicons"
          iconName="storefront-outline"
          onPress={() => navigation.navigate('MarketplaceMyListings')}
        />
        <FeatureHubCard
          title={t('marketplace.merchant.title')}
          subtitle={t('marketplace.merchant.hubSubtitle')}
          iconType="Ionicons"
          iconName="briefcase-outline"
          onPress={() => navigation.navigate('MerchantHub')}
        />
        <FeatureHubCard
          title={t('marketplace.search')}
          subtitle={t('marketplace.searchSubtitle')}
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('MarketplaceSearch')}
        />
      </View>
    </ScreenContainer>
  );
};

export default MarketplaceHub;
