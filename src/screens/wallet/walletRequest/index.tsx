import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {requestMoney} from '@redux/slices/walletSlice';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletRequestProps {
  navigation: AppStackNavigationProp<'WalletRequest'>;
}

const WalletRequest = ({navigation}: WalletRequestProps): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [from, setFrom] = useState('');
  const [amount, setAmount] = useState('');

  const accept = () => {
    const value = parseFloat(amount);
    if (!from.trim() || Number.isNaN(value) || value <= 0) return;
    dispatch(requestMoney({from: from.trim(), amount: value}));
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('wallet.requestMoneyTitle')} navigation={navigation} />
      <Card>
        <Heading text={t('wallet.acceptMoneyRequest')} level="h3" />
        <Spacer size="md" />
        <TextInputView placeholder={t('wallet.fromName')} value={from} onChangeText={setFrom} />
        <Spacer size="sm" />
        <TextInputView
          placeholder={t('wallet.amount')}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Spacer size="md" />
        <Button label={t('wallet.acceptRequest')} fullWidth onPress={accept} />
      </Card>
    </ScreenContainer>
  );
};

export default WalletRequest;
