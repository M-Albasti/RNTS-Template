import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Rating from '@atoms/Rating';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';

import type {MerchantReview} from '@Types/marketplaceTypes';

type MerchantReviewCardProps = {
  review: MerchantReview;
  replyDraft: string;
  onReplyDraftChange: (text: string) => void;
  onSubmitReply: () => void;
  onMarkRead: () => void;
};

const MerchantReviewCard = ({
  review,
  replyDraft,
  onReplyDraftChange,
  onSubmitReply,
  onMarkRead,
}: MerchantReviewCardProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    card: {gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm},
    row: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    unreadDot: {
      width: tokens.sizes.ratingDot,
      height: tokens.sizes.ratingDot,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primary,
    },
    actions: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.sm,
    },
    replyBox: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
    },
  }));

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <TextView text={review.customerName} variant="bodySmall" />
        {!review.isRead ? <View style={styles.unreadDot} /> : null}
      </View>
      <Rating value={review.rating} showValue size={14} />
      <TextView text={review.comment} variant="bodySmall" />
      <TextView
        text={new Date(review.createdAt).toLocaleDateString()}
        variant="caption"
        muted
      />
      {review.merchantReply ? (
        <View style={styles.replyBox}>
          <TextView text={t('marketplace.merchant.yourReply')} variant="caption" muted />
          <TextView text={review.merchantReply} variant="bodySmall" />
        </View>
      ) : (
        <>
          <TextInputView
            label={t('marketplace.merchant.replyToReview')}
            value={replyDraft}
            onChangeText={onReplyDraftChange}
            multiline
          />
          <View style={styles.actions}>
            <Button
              label={t('marketplace.merchant.sendReply')}
              variant="primary"
              onPress={onSubmitReply}
            />
            {!review.isRead ? (
              <Button
                label={t('marketplace.merchant.markRead')}
                variant="outline"
                onPress={onMarkRead}
              />
            ) : null}
          </View>
        </>
      )}
    </Card>
  );
};

export default MerchantReviewCard;
