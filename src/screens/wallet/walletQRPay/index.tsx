import React, {useState} from 'react';

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
  const balance = useAppSelector(state => state.wallet.balance);
  const dispatch = useAppDispatch();
  const [merchant, setMerchant] = useState('Coffee Corner');
  const [amount, setAmount] = useState('12.50');

  const pay = () => {
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) return;
    dispatch(qrPay({merchant: merchant.trim() || 'Merchant', amount: value}));
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll centered alignContent="center">
      <ScreenHeader title="QR Pay" onBack={() => navigation.goBack()} />
      <Card constrained>
        <Heading text="Scan & pay" level="h2" align="center" />
        <Spacer size="md" />
        <TextView text="━━━━ QR CODE ━━━━" align="center" muted />
        <TextView text="(Demo scanner)" align="center" variant="caption" muted />
        <Spacer size="lg" />
        <TextView text={`Balance: $${balance.toFixed(2)}`} align="center" />
        <Spacer size="md" />
        <TextInputView placeholder="Merchant" value={merchant} onChangeText={setMerchant} />
        <Spacer size="sm" />
        <TextInputView placeholder="Amount" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
        <Spacer size="md" />
        <Button label="Confirm payment" fullWidth onPress={pay} />
      </Card>
    </ScreenContainer>
  );
};

export default WalletQRPay;
