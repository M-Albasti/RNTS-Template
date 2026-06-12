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
import {topUp} from '@redux/slices/walletSlice';
import type {AppStackNavigationProp} from '@Types/appNavigation';

const QUICK_AMOUNTS = [25, 50, 100, 250];

interface WalletTopUpProps {
  navigation: AppStackNavigationProp<'WalletTopUp'>;
}

const WalletTopUp = ({navigation}: WalletTopUpProps): React.JSX.Element => {
  const balance = useAppSelector(state => state.wallet.balance);
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState('');

  const addAmount = (value: number) => {
    dispatch(topUp(value));
    navigation.goBack();
  };

  const customTopUp = () => {
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) return;
    addAmount(value);
  };

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Top up" onBack={() => navigation.goBack()} />
      <Card>
        <Heading text={`Current balance: $${balance.toFixed(2)}`} level="h3" />
        <Spacer size="lg" />
        <TextView text="Quick amounts" variant="bodySmall" muted />
        <Spacer size="sm" />
        {QUICK_AMOUNTS.map(value => (
          <React.Fragment key={value}>
            <Button label={`+$${value}`} fullWidth onPress={() => addAmount(value)} />
            <Spacer size="sm" />
          </React.Fragment>
        ))}
        <TextInputView
          placeholder="Custom amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Spacer size="sm" />
        <Button label="Add custom amount" variant="secondary" fullWidth onPress={customTopUp} />
      </Card>
    </ScreenContainer>
  );
};

export default WalletTopUp;
