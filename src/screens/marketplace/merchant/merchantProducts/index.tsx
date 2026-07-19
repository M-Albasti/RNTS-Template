import React from 'react';
import {Alert, Switch, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import ProductStatusBadge from '@molecules/marketplace/ProductStatusBadge';
import Rating from '@atoms/Rating';
import {formatCurrency} from '@helpers/locationHelpers';
import {getMerchantProducts} from '@helpers/marketplaceHelpers';
import {
  markProductOutOfStock,
  removeProductListing,
  toggleProductEnabled,
} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMerchantProductsStyles} from './styles/resolveMerchantProductsStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MerchantProducts'>};

const MerchantProducts = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.marketplace.products);
  const merchantProducts = getMerchantProducts(products);

  const styles = useThemedStyles(resolveMerchantProductsStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('marketplace.merchant.products')}
        onBack={() => navigation.goBack()}
      />
      <Button
        label={t('marketplace.merchant.addProduct')}
        fullWidth
        onPress={() => navigation.navigate('MerchantEditProduct', {})}
      />
      <Spacer size="md" />
      {merchantProducts.length === 0 ? (
        <TextView text={t('marketplace.merchant.noProducts')} align="center" muted />
      ) : (
        <FlashList
          data={merchantProducts}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Card style={styles.productCard}>
              <View style={styles.row}>
                <TextView text={`${item.imageEmoji} ${item.title}`} variant="bodySmall" />
                <ProductStatusBadge product={item} />
              </View>
              <TextView text={formatCurrency(item.price, item.currency)} variant="h3" />
              <Rating value={item.rating} reviewCount={item.reviewCount} sizeToken="sm" />
              <TextView text={t('marketplace.stockLeft', {count: item.stock})} variant="caption" muted />
              <View style={styles.row}>
                <TextView text={t('marketplace.merchant.enabled')} variant="caption" />
                <Switch
                  value={item.isEnabled}
                  onValueChange={() => {
                    dispatch(toggleProductEnabled(item.id));
                  }}
                />
              </View>
              <View style={styles.actions}>
                <Button
                  label={t('marketplace.merchant.editProduct')}
                  variant="outline"
                  onPress={() => navigation.navigate('MerchantEditProduct', {productId: item.id})}
                />
                <Button
                  label={t('marketplace.merchant.markOutOfStock')}
                  variant="secondary"
                  onPress={() => dispatch(markProductOutOfStock(item.id))}
                />
                <Button
                  label={t('common.delete')}
                  variant="danger"
                  onPress={() => {
                    dispatch(removeProductListing(item.id));
                    Alert.alert(
                      t('marketplace.listingRemovedTitle'),
                      t('marketplace.listingRemovedBody'),
                    );
                  }}
                />
              </View>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default MerchantProducts;
