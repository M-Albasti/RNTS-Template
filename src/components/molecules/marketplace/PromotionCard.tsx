import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolvePromotionCardStyles} from './styles/resolvePromotionCardStyles';

import type {MerchantPromotion} from '@Types/marketplaceTypes';

type PromotionCardProps = {
  promotion: MerchantPromotion;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const PromotionCard = ({
  promotion,
  onToggle,
  onEdit,
  onDelete,
}: PromotionCardProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(
    tokens => resolvePromotionCardStyles(tokens, promotion),
    [promotion],
  );

  const valueLabel =
    promotion.type === 'percentage'
      ? t('marketplace.merchant.promoPercent', {value: promotion.value})
      : promotion.type === 'fixed'
        ? t('marketplace.merchant.promoFixed', {value: promotion.value})
        : t('marketplace.merchant.promoBundle');

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <TextView text={promotion.title} variant="h3" />
        <View style={styles.activePill}>
          <TextView
            text={
              promotion.isActive
                ? t('marketplace.merchant.promoActive')
                : t('marketplace.merchant.promoPaused')
            }
            variant="caption"
          />
        </View>
      </View>
      <TextView text={promotion.description} variant="bodySmall" muted />
      <TextView text={valueLabel} variant="caption" />
      {promotion.minOrderAmount ? (
        <TextView
          text={t('marketplace.merchant.minOrder', {amount: promotion.minOrderAmount})}
          variant="caption"
          muted
        />
      ) : null}
      <View style={styles.actions}>
        <Button
          label={
            promotion.isActive
              ? t('marketplace.merchant.pausePromo')
              : t('marketplace.merchant.activatePromo')
          }
          variant="secondary"
          onPress={onToggle}
        />
        <Button label={t('marketplace.merchant.editPromo')} variant="outline" onPress={onEdit} />
        <Button label={t('common.delete')} variant="danger" onPress={onDelete} />
      </View>
    </Card>
  );
};

export default PromotionCard;
