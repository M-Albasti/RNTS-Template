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

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {payBill} from '@redux/slices/walletSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletBillsProps {
  navigation: AppStackNavigationProp<'WalletBills'>;
}

const WalletBills = ({navigation}: WalletBillsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const bills = useAppSelector(state => state.wallet.bills);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {...tokens.layout.presets.rowBetween},
      paid: {opacity: 0.5},
    }),
  );

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('wallet.billPay')} onBack={() => navigation.goBack()} />
      {bills.map(bill => (
        <View key={bill.id}>
          <Card style={bill.paid ? styles.paid : undefined}>
            <View style={styles.row}>
              <View>
                <Heading text={bill.payee} level="h3" />
                <TextView
                  text={`${t('wallet.dueDate', {date: bill.dueDate})}${
                    bill.recurring ? ` ${t('wallet.recurringSuffix')}` : ''
                  }`}
                  variant="caption"
                  muted
                />
              </View>
              <TextView text={`$${bill.amount.toFixed(2)}`} variant="body" />
            </View>
            <Spacer size="sm" />
            <Button
              label={bill.paid ? t('wallet.paid') : t('wallet.payNow')}
              variant={bill.paid ? 'ghost' : 'primary'}
              fullWidth
              disabled={bill.paid}
              onPress={() => dispatch(payBill(bill.id))}
            />
          </Card>
          <Spacer size="sm" />
        </View>
      ))}
    </ScreenContainer>
  );
};

export default WalletBills;
