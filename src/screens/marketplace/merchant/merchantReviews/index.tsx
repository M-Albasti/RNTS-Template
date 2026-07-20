import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Rating from '@atoms/Rating';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import MerchantReviewCard from '@molecules/marketplace/MerchantReviewCard';
import {getMerchantReviews} from '@helpers/marketplaceHelpers';
import {
  markAllReviewsRead,
  markReviewRead,
  respondToMerchantReview,
} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MerchantReviews'>};

const MerchantReviews = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {reviews, merchantStore} = useAppSelector(state => state.marketplace);
  const sortedReviews = getMerchantReviews(reviews);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const submitReply = (reviewId: string) => {
    const reply = replyDrafts[reviewId]?.trim();
    if (!reply) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.merchant.replyRequired'));
      return;
    }
    dispatch(respondToMerchantReview({reviewId, reply}));
    setReplyDrafts(prev => ({...prev, [reviewId]: ''}));
    Alert.alert(t('marketplace.merchant.replySentTitle'), t('marketplace.merchant.replySentBody'));
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('marketplace.merchant.reviews')}
        navigation={navigation} />
      <Rating
        value={merchantStore.rating}
        showValue
        reviewCount={merchantStore.reviewCount}
        size={20}
      />
      <Spacer size="sm" />
      <Button
        label={t('marketplace.merchant.markAllRead')}
        variant="outline"
        fullWidth
        onPress={() => dispatch(markAllReviewsRead())}
      />
      <Spacer size="md" />
      {sortedReviews.length === 0 ? (
        <TextView text={t('marketplace.merchant.noReviews')} align="center" muted />
      ) : (
        sortedReviews.map(review => (
          <MerchantReviewCard
            key={review.id}
            review={review}
            replyDraft={replyDrafts[review.id] ?? ''}
            onReplyDraftChange={text =>
              setReplyDrafts(prev => ({...prev, [review.id]: text}))
            }
            onSubmitReply={() => submitReply(review.id)}
            onMarkRead={() => dispatch(markReviewRead(review.id))}
          />
        ))
      )}
    </ScreenContainer>
  );
};

export default MerchantReviews;
