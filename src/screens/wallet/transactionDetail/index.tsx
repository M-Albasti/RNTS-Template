import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveTransactionDetailStyles} from './styles/resolveTransactionDetailStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface TransactionDetailProps {
  navigation: AppStackNavigationProp<'TransactionDetail'>;
  route: AppRouteProp<'TransactionDetail'>;
}

const TransactionDetail = ({
  navigation,
  route,
}: TransactionDetailProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {transactionId} = route.params;
  const tx = useAppSelector(state =>
    state.wallet.transactions.find(item => item.id === transactionId),
  );
  const styles = useThemedStyles(resolveTransactionDetailStyles);

  if (!tx) {
    return (
      <ScreenContainer centered>
        <TextView text={t('wallet.transactionNotFound')} />
        <Spacer size="md" />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('wallet.transactionTitle')} onBack={() => navigation.goBack()} />
      <Card>
        <Heading text={tx.title} level="h2" align="center" />
        <Spacer size="md" />
        <TextView
          text={`${tx.type === 'credit' ? '+' : '-'}$${tx.amount.toFixed(2)}`}
          style={[styles.amount, tx.type === 'credit' ? styles.credit : styles.debit]}
        />
        <Spacer size="lg" />
        <View style={styles.row}>
          <TextView text={t('wallet.date')} muted />
          <TextView text={tx.date} />
        </View>
        <Spacer size="sm" />
        <View style={styles.row}>
          <TextView text={t('wallet.category')} muted />
          <TextView text={tx.category} />
        </View>
        <Spacer size="sm" />
        <View style={styles.row}>
          <TextView text={t('wallet.type')} muted />
          <TextView text={tx.type} />
        </View>
        {tx.note ? (
          <>
            <Spacer size="md" />
            <TextView text={t('wallet.note')} muted />
            <Spacer size="xs" />
            <TextView text={tx.note} variant="bodySmall" />
          </>
        ) : null}
      </Card>
    </ScreenContainer>
  );
};

export default TransactionDetail;
