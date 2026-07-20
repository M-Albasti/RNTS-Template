import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {MARKETPLACE_CATEGORIES, SEED_MERCHANT_STORE} from '@constants/marketplaceMockData';
import {
  addProductListing,
  setProductStock,
  updateProductListing,
} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {MERCHANT_STORE_ID} from '@Types/marketplaceTypes';

type Props = {
  navigation: AppStackNavigationProp<'MerchantEditProduct'>;
  route: AppRouteProp<'MerchantEditProduct'>;
};

const MerchantEditProduct = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const productId = route.params?.productId;
  const existing = useAppSelector(state =>
    productId ? state.marketplace.products.find(p => p.id === productId) : undefined,
  );

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [stock, setStock] = useState(existing ? String(existing.stock) : '10');
  const [emoji, setEmoji] = useState(existing?.imageEmoji ?? '🏷️');
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? MARKETPLACE_CATEGORIES[0].id);

  const save = () => {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!title.trim() || !description.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.invalidListing'));
      return;
    }

    if (existing) {
      dispatch(
        updateProductListing({
          productId: existing.id,
          updates: {
            title: title.trim(),
            description: description.trim(),
            price: parsedPrice,
            imageEmoji: emoji.trim() || '🏷️',
            categoryId,
          },
        }),
      );
      dispatch(setProductStock({productId: existing.id, stock: parsedStock >= 0 ? parsedStock : 0}));
    } else {
      dispatch(
        addProductListing({
          id: `mprod-${Date.now()}`,
          categoryId,
          title: title.trim(),
          description: description.trim(),
          price: parsedPrice,
          currency: 'AED',
          imageEmoji: emoji.trim() || '🏷️',
          sellerName: SEED_MERCHANT_STORE.name,
          rating: 5,
          reviewCount: 0,
          stock: parsedStock >= 0 ? parsedStock : 0,
          isEnabled: true,
          merchantId: MERCHANT_STORE_ID,
          isOwnListing: true,
        }),
      );
    }

    Alert.alert(
      t('marketplace.merchant.productSavedTitle'),
      t('marketplace.merchant.productSavedBody'),
    );
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={
          existing
            ? t('marketplace.merchant.editProduct')
            : t('marketplace.merchant.addProduct')
        }
        navigation={navigation} />
      <TextInputView label={t('marketplace.listingTitle')} value={title} onChangeText={setTitle} />
      <TextInputView
        label={t('marketplace.listingDescription')}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInputView
        label={t('marketplace.listingPrice')}
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />
      <TextInputView
        label={t('marketplace.listingStock')}
        value={stock}
        onChangeText={setStock}
        keyboardType="number-pad"
      />
      <TextInputView
        label={t('marketplace.merchant.emojiLabel')}
        value={emoji}
        onChangeText={setEmoji}
      />
      <Spacer size="sm" />
      <TextView text={t('marketplace.listingCategory')} variant="h3" />
      <Spacer size="sm" />
      {MARKETPLACE_CATEGORIES.map(cat => (
        <Button
          key={cat.id}
          label={t(cat.nameKey)}
          variant={categoryId === cat.id ? 'primary' : 'outline'}
          fullWidth
          onPress={() => setCategoryId(cat.id)}
        />
      ))}
      <Spacer size="lg" />
      <Button label={t('marketplace.merchant.saveProduct')} fullWidth onPress={save} />
    </ScreenContainer>
  );
};

export default MerchantEditProduct;
