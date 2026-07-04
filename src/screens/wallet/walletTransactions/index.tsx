import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveWalletTransactionsStyles} from './styles/resolveWalletTransactionsStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {WalletTransaction} from '@Types/walletTypes';

interface WalletTransactionsProps {
  navigation: AppStackNavigationProp<'WalletTransactions'>;
}

const WalletTransactions = ({
  navigation,
}: WalletTransactionsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const transactions = useAppSelector(state => state.wallet.transactions);
  const styles = useThemedStyles(resolveWalletTransactionsStyles);

  const renderItem = ({item}: {item: WalletTransaction}) => (
    <Pressable onPress={() => navigation.navigate('TransactionDetail', {transactionId: item.id})}>
      <Card>
        <View style={styles.row}>
          <View>
            <Heading text={item.title} level="h3" />
            <TextView text={`${item.category} · ${item.date}`} variant="caption" muted />
          </View>
          <TextView
            text={`${item.type === 'credit' ? '+' : '-'}$${item.amount.toFixed(2)}`}
            variant="body"
            style={item.type === 'credit' ? styles.credit : styles.debit}
          />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('wallet.transactionsTitle')} onBack={() => navigation.goBack()} />
      <FlashList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default WalletTransactions;
