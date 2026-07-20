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
import {topUp, transfer} from '@redux/slices/walletSlice';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletSendProps {
  navigation: AppStackNavigationProp<'WalletSend'>;
}

const WalletSend = ({navigation}: WalletSendProps): React.JSX.Element => {
  const {t} = useTranslation();
  const balance = useAppSelector(state => state.wallet.balance);
  const dispatch = useAppDispatch();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const sendMoney = () => {
    const value = parseFloat(amount);
    if (!recipient.trim() || Number.isNaN(value) || value <= 0) return;
    if (value > balance) return;
    dispatch(
      transfer({
        title: t('wallet.transferTo', {recipient: recipient.trim()}),
        amount: value,
      }),
    );
    navigation.goBack();
  };

  const addFunds = () => {
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) return;
    dispatch(topUp(value));
    setAmount('');
  };

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('wallet.sendAndTopUp')} navigation={navigation} />
      <Card>
        <Heading
          text={t('wallet.balanceLabel', {balance: balance.toFixed(2)})}
          level="h3"
        />
        <Spacer size="md" />
        <TextInputView
          placeholder={t('wallet.recipientName')}
          value={recipient}
          onChangeText={setRecipient}
        />
        <Spacer size="sm" />
        <TextInputView
          placeholder={t('wallet.amount')}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Spacer size="md" />
        <Button label={t('wallet.sendTransfer')} fullWidth onPress={sendMoney} />
        <Spacer size="sm" />
        <Button
          label={t('wallet.topUpWallet')}
          variant="secondary"
          fullWidth
          onPress={addFunds}
        />
        <Spacer size="sm" />
        <TextView text={t('wallet.demoTransfersNote')} variant="caption" muted />
      </Card>
    </ScreenContainer>
  );
};

export default WalletSend;
