import React from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import PromotionCard from '@molecules/marketplace/PromotionCard';
import {removePromotion, togglePromotionActive} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MerchantPromotions'>};

const MerchantPromotions = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const promotions = useAppSelector(state => state.marketplace.promotions);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('marketplace.merchant.promotions')}
        navigation={navigation} />
      <Button
        label={t('marketplace.merchant.createPromo')}
        fullWidth
        onPress={() => navigation.navigate('MerchantEditPromotion', {})}
      />
      <Spacer size="md" />
      {promotions.length === 0 ? (
        <TextView text={t('marketplace.merchant.noPromotions')} align="center" muted />
      ) : (
        promotions.map(promo => (
          <PromotionCard
            key={promo.id}
            promotion={promo}
            onToggle={() => dispatch(togglePromotionActive(promo.id))}
            onEdit={() => navigation.navigate('MerchantEditPromotion', {promotionId: promo.id})}
            onDelete={() => {
              dispatch(removePromotion(promo.id));
              Alert.alert(
                t('marketplace.merchant.promoDeletedTitle'),
                t('marketplace.merchant.promoDeletedBody'),
              );
            }}
          />
        ))
      )}
    </ScreenContainer>
  );
};

export default MerchantPromotions;
