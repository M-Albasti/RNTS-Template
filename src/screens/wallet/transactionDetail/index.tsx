import React from 'react';
import {StyleSheet, View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface TransactionDetailProps {
  navigation: AppStackNavigationProp<'TransactionDetail'>;
  route: AppRouteProp<'TransactionDetail'>;
}

const TransactionDetail = ({
  navigation,
  route,
}: TransactionDetailProps): React.JSX.Element => {
  const {transactionId} = route.params;
  const tx = useAppSelector(state =>
    state.wallet.transactions.find(t => t.id === transactionId),
  );
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      amount: {
        ...tokens.layout.presets.textCenter,
        ...tokens.typography.h1,
      },
      credit: {color: tokens.colors.success},
      debit: {color: tokens.colors.error},
      row: {...tokens.layout.presets.rowBetween},
    }),
  );

  if (!tx) {
    return (
      <ScreenContainer centered>
        <TextView text="Transaction not found" />
        <Spacer size="md" />
        <Button label="Go back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Transaction" onBack={() => navigation.goBack()} />
      <Card>
        <Heading text={tx.title} level="h2" align="center" />
        <Spacer size="md" />
        <TextView
          text={`${tx.type === 'credit' ? '+' : '-'}$${tx.amount.toFixed(2)}`}
          style={[styles.amount, tx.type === 'credit' ? styles.credit : styles.debit]}
        />
        <Spacer size="lg" />
        <View style={styles.row}>
          <TextView text="Date" muted />
          <TextView text={tx.date} />
        </View>
        <Spacer size="sm" />
        <View style={styles.row}>
          <TextView text="Category" muted />
          <TextView text={tx.category} />
        </View>
        <Spacer size="sm" />
        <View style={styles.row}>
          <TextView text="Type" muted />
          <TextView text={tx.type} />
        </View>
        {tx.note ? (
          <>
            <Spacer size="md" />
            <TextView text="Note" muted />
            <Spacer size="xs" />
            <TextView text={tx.note} variant="bodySmall" />
          </>
        ) : null}
      </Card>
    </ScreenContainer>
  );
};

export default TransactionDetail;
