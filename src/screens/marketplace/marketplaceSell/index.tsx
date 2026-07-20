import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {MARKETPLACE_CATEGORIES} from '@constants/marketplaceMockData';
import {addProductListing} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceSell'>};

const MarketplaceSell = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [categoryId, setCategoryId] = useState(MARKETPLACE_CATEGORIES[0].id);

  const publish = () => {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!title.trim() || !description.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.invalidListing'));
      return;
    }

    dispatch(
      addProductListing({
        id: `prod-user-${Date.now()}`,
        categoryId,
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        currency: 'AED',
        imageEmoji: '🏷️',
        sellerName: t('marketplace.yourShop'),
        rating: 5,
        reviewCount: 0,
        stock: parsedStock > 0 ? parsedStock : 1,
        isEnabled: true,
        isOwnListing: true,
      }),
    );
    Alert.alert(t('marketplace.listingPublishedTitle'), t('marketplace.listingPublishedBody'));
    navigation.navigate('MarketplaceMyListings');
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.sellItem')} navigation={navigation} />
      <TextInputView label={t('marketplace.listingTitle')} value={title} onChangeText={setTitle} />
      <TextInputView
        label={t('marketplace.listingDescription')}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInputView label={t('marketplace.listingPrice')} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <TextInputView label={t('marketplace.listingStock')} value={stock} onChangeText={setStock} keyboardType="number-pad" />
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
      <Button label={t('marketplace.publishListing')} fullWidth onPress={publish} />
    </ScreenContainer>
  );
};

export default MarketplaceSell;
