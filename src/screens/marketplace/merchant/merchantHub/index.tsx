import React from 'react';
import {Alert, Pressable, Switch, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import Rating from '@atoms/Rating';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import MerchantStatCard from '@molecules/marketplace/MerchantStatCard';
import {formatCurrency} from '@helpers/locationHelpers';
import {
  getLowStockProducts,
  getMerchantOrderTotal,
  getMerchantReviews,
  getMerchantStats,
  getRecentMerchantOrders,
} from '@helpers/marketplaceHelpers';
import {
  quickRestockProduct,
  toggleMerchantStoreOpen,
} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MerchantHub'>};

const MerchantHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {products, orders, promotions, merchantStore, reviews} = useAppSelector(
    state => state.marketplace,
  );
  const stats = getMerchantStats(products, orders, promotions, reviews);
  const recentOrders = getRecentMerchantOrders(orders);
  const lowStockProducts = getLowStockProducts(products);
  const latestReviews = getMerchantReviews(reviews).slice(0, 2);

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      gap: tokens.spacing.sm,
    },
    stats: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    openBadge: {
      alignSelf: 'flex-start' as const,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      backgroundColor: merchantStore.isOpen
        ? tokens.colors.successMuted
        : tokens.colors.surfaceSecondary,
    },
    section: {gap: tokens.spacing.sm},
    alertCard: {gap: tokens.spacing.xs, marginBottom: tokens.spacing.xs},
    quickActions: {flexDirection: 'row' as const, gap: tokens.spacing.sm, flexWrap: 'wrap' as const},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.merchant.title')} onBack={() => navigation.goBack()} />
      <View style={styles.hero}>
        <Heading text={merchantStore.name} level="h2" />
        <TextView text={merchantStore.description} muted />
        <Rating
          value={merchantStore.rating}
          showValue
          reviewCount={merchantStore.reviewCount}
          size={18}
        />
        <View style={styles.row}>
          <View style={styles.openBadge}>
            <TextView
              text={
                merchantStore.isOpen
                  ? t('marketplace.merchant.storeOpen')
                  : t('marketplace.merchant.storeClosed')
              }
              variant="caption"
            />
          </View>
          <Switch
            value={merchantStore.isOpen}
            onValueChange={() => {
              dispatch(toggleMerchantStoreOpen());
            }}
          />
        </View>
      </View>

      <Spacer size="md" />
      <View style={styles.quickActions}>
        <Button
          label={t('marketplace.merchant.addProduct')}
          onPress={() => navigation.navigate('MerchantEditProduct', {})}
        />
        <Button
          label={t('marketplace.merchant.orders')}
          variant="secondary"
          onPress={() => navigation.navigate('MerchantOrders')}
        />
        <Button
          label={t('marketplace.merchant.reviews')}
          variant="outline"
          onPress={() => navigation.navigate('MerchantReviews')}
        />
      </View>

      <Spacer size="lg" />
      <Heading text={t('marketplace.merchant.dashboard')} level="h3" />
      <Spacer size="sm" />
      <View style={styles.stats}>
        <MerchantStatCard
          label={t('marketplace.merchant.statProducts')}
          value={String(stats.activeProducts)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statOutOfStock')}
          value={String(stats.outOfStock)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statDisabled')}
          value={String(stats.disabledProducts)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statLowStock')}
          value={String(stats.lowStockCount)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statPendingOrders')}
          value={String(stats.pendingOrders)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statPromotions')}
          value={String(stats.activePromotions)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statAvgRating')}
          value={stats.averageProductRating.toFixed(1)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statUnreadReviews')}
          value={String(stats.unreadReviews)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statRevenue')}
          value={formatCurrency(stats.revenue)}
        />
        <MerchantStatCard
          label={t('marketplace.merchant.statFulfilled')}
          value={String(merchantStore.fulfilledOrders)}
        />
      </View>

      {recentOrders.length > 0 ? (
        <>
          <Spacer size="lg" />
          <View style={styles.section}>
            <View style={styles.row}>
              <Heading text={t('marketplace.merchant.recentOrders')} level="h3" />
              <Pressable onPress={() => navigation.navigate('MerchantOrders')}>
                <TextView text={t('marketplace.merchant.viewAll')} variant="caption" />
              </Pressable>
            </View>
            {recentOrders.map(order => (
              <Pressable
                key={order.id}
                onPress={() => navigation.navigate('MerchantOrderDetail', {orderId: order.id})}>
                <Card style={styles.alertCard}>
                  <TextView text={`#${order.id.slice(-6)}`} variant="caption" muted />
                  <TextView text={t(`marketplace.status.${order.status}`)} variant="bodySmall" />
                  <TextView
                    text={formatCurrency(getMerchantOrderTotal(order))}
                    variant="caption"
                  />
                </Card>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {lowStockProducts.length > 0 ? (
        <>
          <Spacer size="lg" />
          <View style={styles.section}>
            <Heading text={t('marketplace.merchant.lowStockAlerts')} level="h3" />
            {lowStockProducts.map(product => (
              <Card key={product.id} style={styles.alertCard}>
                <TextView
                  text={t('marketplace.merchant.lowStockLine', {
                    title: product.title,
                    count: product.stock,
                  })}
                  variant="bodySmall"
                />
                <View style={styles.quickActions}>
                  <Button
                    label={t('marketplace.merchant.restockTen')}
                    variant="secondary"
                    onPress={() => {
                      dispatch(quickRestockProduct({productId: product.id, amount: 10}));
                      Alert.alert(
                        t('marketplace.merchant.restockedTitle'),
                        t('marketplace.merchant.restockedBody'),
                      );
                    }}
                  />
                  <Button
                    label={t('marketplace.merchant.editProduct')}
                    variant="outline"
                    onPress={() =>
                      navigation.navigate('MerchantEditProduct', {productId: product.id})
                    }
                  />
                </View>
              </Card>
            ))}
          </View>
        </>
      ) : null}

      {latestReviews.length > 0 ? (
        <>
          <Spacer size="lg" />
          <View style={styles.section}>
            <View style={styles.row}>
              <Heading text={t('marketplace.merchant.latestReviews')} level="h3" />
              <Pressable onPress={() => navigation.navigate('MerchantReviews')}>
                <TextView text={t('marketplace.merchant.viewAll')} variant="caption" />
              </Pressable>
            </View>
            {latestReviews.map(review => (
              <Card key={review.id} style={styles.alertCard}>
                <TextView text={review.customerName} variant="bodySmall" />
                <Rating value={review.rating} size={14} />
                <TextView text={review.comment} variant="caption" muted numberOfLines={2} />
              </Card>
            ))}
          </View>
        </>
      ) : null}

      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('marketplace.merchant.products')}
          subtitle={t('marketplace.merchant.productsSubtitle')}
          iconType="Ionicons"
          iconName="fast-food-outline"
          onPress={() => navigation.navigate('MerchantProducts')}
        />
        <FeatureHubCard
          title={t('marketplace.merchant.promotions')}
          subtitle={t('marketplace.merchant.promotionsSubtitle')}
          iconType="Ionicons"
          iconName="pricetags-outline"
          onPress={() => navigation.navigate('MerchantPromotions')}
        />
        <FeatureHubCard
          title={t('marketplace.merchant.orders')}
          subtitle={t('marketplace.merchant.ordersSubtitle', {count: stats.pendingOrders})}
          iconType="Ionicons"
          iconName="receipt-outline"
          onPress={() => navigation.navigate('MerchantOrders')}
        />
        <FeatureHubCard
          title={t('marketplace.merchant.reviews')}
          subtitle={t('marketplace.merchant.reviewsSubtitle', {count: stats.unreadReviews})}
          iconType="Ionicons"
          iconName="star-outline"
          onPress={() => navigation.navigate('MerchantReviews')}
        />
        <FeatureHubCard
          title={t('marketplace.merchant.storeSettings')}
          subtitle={t('marketplace.merchant.storeSettingsSubtitle')}
          iconType="Ionicons"
          iconName="storefront-outline"
          onPress={() => navigation.navigate('MerchantStoreSettings')}
        />
      </View>
    </ScreenContainer>
  );
};

export default MerchantHub;
