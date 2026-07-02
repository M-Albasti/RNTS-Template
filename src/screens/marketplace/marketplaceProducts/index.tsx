import React from 'react';
import {FlatList, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ProductCard from '@molecules/marketplace/ProductCard';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';

import {MARKETPLACE_CATEGORIES} from '@constants/marketplaceMockData';
import {addToCart} from '@redux/slices/marketplaceSlice';
import {filterProducts} from '@helpers/marketplaceHelpers';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMarketplaceProductsStyles} from './styles/resolveMarketplaceProductsStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'MarketplaceProducts'>;
  route: AppRouteProp<'MarketplaceProducts'>;
};

const MarketplaceProducts = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.marketplace.products);
  const categoryId = route.params?.categoryId;
  const searchQuery = route.params?.searchQuery;
  const filtered = filterProducts(products, {categoryId, searchQuery});

  const styles = useThemedStyles(resolveMarketplaceProductsStyles);

  const category = MARKETPLACE_CATEGORIES.find(c => c.id === categoryId);
  const title = category
    ? t(category.nameKey)
    : searchQuery
      ? t('marketplace.searchResults')
      : t('marketplace.allProducts');

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {filtered.length === 0 ? (
        <TextView text={t('marketplace.noProducts')} align="center" muted />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          scrollEnabled={false}
          renderItem={({item}) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('MarketplaceProductDetail', {productId: item.id})}
              onAdd={() => dispatch(addToCart({productId: item.id}))}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default MarketplaceProducts;
