import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {qrPay} from '@redux/slices/walletSlice';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletQRPayProps {
  navigation: AppStackNavigationProp<'WalletQRPay'>;
}

const WalletQRPay = ({navigation}: WalletQRPayProps): React.JSX.Element => {
  const {t} = useTranslation();
  const balance = useAppSelector(state => state.wallet.balance);
  const dispatch = useAppDispatch();
  const [merchant, setMerchant] = useState('Coffee Corner');
  const [amount, setAmount] = useState('12.50');

  const pay = () => {
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) return;
    dispatch(qrPay({merchant: merchant.trim() || t('wallet.merchant'), amount: value}));
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll centered alignContent="center">
      <ScreenHeader title={t('wallet.qrPay')} onBack={() => navigation.goBack()} />
      <Card constrained>
        <Heading text={t('wallet.scanAndPay')} level="h2" align="center" />
        <Spacer size="md" />
        <TextView text={t('wallet.qrCodeDemo')} align="center" muted />
        <TextView text={t('wallet.demoScanner')} align="center" variant="caption" muted />
        <Spacer size="lg" />
        <TextView
          text={t('wallet.balanceLabel', {balance: balance.toFixed(2)})}
          align="center"
        />
        <Spacer size="md" />
        <TextInputView
          placeholder={t('wallet.merchant')}
          value={merchant}
          onChangeText={setMerchant}
        />
        <Spacer size="sm" />
        <TextInputView
          placeholder={t('wallet.amount')}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Spacer size="md" />
        <Button label={t('wallet.confirmPayment')} fullWidth onPress={pay} />
      </Card>
    </ScreenContainer>
  );
};

export default WalletQRPay;
