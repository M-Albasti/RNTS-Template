import React, {useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {getMerchantProducts} from '@helpers/marketplaceHelpers';
import {upsertPromotion} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {MerchantPromotionType} from '@Types/marketplaceTypes';

type Props = {
  navigation: AppStackNavigationProp<'MerchantEditPromotion'>;
  route: AppRouteProp<'MerchantEditPromotion'>;
};

const PROMO_TYPES: MerchantPromotionType[] = ['percentage', 'fixed', 'bundle'];

const MerchantEditPromotion = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens => ({
    productRow: {marginBottom: tokens.spacing.sm},
  }));
  const {products, promotions} = useAppSelector(state => state.marketplace);
  const merchantProducts = useMemo(() => getMerchantProducts(products), [products]);
  const promotionId = route.params?.promotionId;
  const existing = promotionId ? promotions.find(p => p.id === promotionId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [type, setType] = useState<MerchantPromotionType>(existing?.type ?? 'percentage');
  const [value, setValue] = useState(existing ? String(existing.value) : '10');
  const [minOrder, setMinOrder] = useState(
    existing?.minOrderAmount ? String(existing.minOrderAmount) : '',
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    existing?.productIds ?? [],
  );

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId],
    );
  };

  const save = () => {
    const parsedValue = Number(value);
    if (!title.trim() || Number.isNaN(parsedValue) || parsedValue <= 0) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.merchant.invalidPromo'));
      return;
    }

    dispatch(
      upsertPromotion({
        id: existing?.id ?? `promo-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        type,
        value: parsedValue,
        productIds: selectedProductIds,
        minOrderAmount: minOrder ? Number(minOrder) : undefined,
        isActive: existing?.isActive ?? true,
        startsAt: existing?.startsAt ?? '2026-06-01T00:00:00Z',
        endsAt: existing?.endsAt ?? '2026-12-31T23:59:59Z',
      }),
    );

    Alert.alert(
      t('marketplace.merchant.promoSavedTitle'),
      t('marketplace.merchant.promoSavedBody'),
    );
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={
          existing
            ? t('marketplace.merchant.editPromo')
            : t('marketplace.merchant.createPromo')
        }
        onBack={() => navigation.goBack()}
      />
      <TextInputView label={t('marketplace.merchant.promoTitle')} value={title} onChangeText={setTitle} />
      <TextInputView
        label={t('marketplace.merchant.promoDescription')}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Spacer size="sm" />
      <TextView text={t('marketplace.merchant.promoType')} variant="h3" />
      <Spacer size="sm" />
      {PROMO_TYPES.map(promoType => (
        <Button
          key={promoType}
          label={t(`marketplace.merchant.promoTypes.${promoType}`)}
          variant={type === promoType ? 'primary' : 'outline'}
          fullWidth
          onPress={() => setType(promoType)}
        />
      ))}
      <TextInputView
        label={t('marketplace.merchant.promoValue')}
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
      />
      <TextInputView
        label={t('marketplace.merchant.minOrderOptional')}
        value={minOrder}
        onChangeText={setMinOrder}
        keyboardType="decimal-pad"
      />
      <Spacer size="sm" />
      <TextView text={t('marketplace.merchant.promoProducts')} variant="h3" />
      <TextView text={t('marketplace.merchant.promoProductsHint')} variant="caption" muted />
      <Spacer size="sm" />
      {merchantProducts.map(product => (
        <View key={product.id} style={styles.productRow}>
          <Button
            label={`${product.imageEmoji} ${product.title}`}
            variant={selectedProductIds.includes(product.id) ? 'primary' : 'outline'}
            fullWidth
            onPress={() => toggleProduct(product.id)}
          />
        </View>
      ))}
      <Spacer size="lg" />
      <Button label={t('marketplace.merchant.savePromo')} fullWidth onPress={save} />
    </ScreenContainer>
  );
};

export default MerchantEditPromotion;
