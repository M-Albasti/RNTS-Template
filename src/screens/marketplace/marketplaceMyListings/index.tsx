import React from 'react';
import {Alert, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {getOwnListings} from '@helpers/marketplaceHelpers';
import {removeProductListing} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMarketplaceMyListingsStyles} from './styles/resolveMarketplaceMyListingsStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceMyListings'>};

const MarketplaceMyListings = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.marketplace.products);
  const listings = getOwnListings(products);
  const styles = useThemedStyles(resolveMarketplaceMyListingsStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.myListings')} onBack={() => navigation.goBack()} />
      <Button
        label={t('marketplace.merchant.title')}
        variant="secondary"
        fullWidth
        onPress={() => navigation.navigate('MerchantHub')}
      />
      <Spacer size="md" />
      {listings.length === 0 ? (
        <>
          <TextView text={t('marketplace.noListings')} align="center" muted />
          <Button
            label={t('marketplace.sellItem')}
            onPress={() => navigation.navigate('MarketplaceSell')}
          />
        </>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Card style={styles.listingCard}>
              <TextView text={`${item.imageEmoji} ${item.title}`} variant="bodySmall" />
              <TextView text={formatCurrency(item.price, item.currency)} variant="h3" />
              <TextView text={t('marketplace.stockLeft', {count: item.stock})} variant="caption" muted />
              <Button
                label={t('marketplace.removeListing')}
                variant="danger"
                onPress={() => {
                  dispatch(removeProductListing(item.id));
                  Alert.alert(t('marketplace.listingRemovedTitle'), t('marketplace.listingRemovedBody'));
                }}
              />
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default MarketplaceMyListings;
