import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {MARKETPLACE_DELIVERY_FEE} from '@constants/marketplaceMockData';
import {SEED_ADDRESSES} from '@constants/deliveryMockData';
import {formatCurrency} from '@helpers/locationHelpers';
import {getCartSubtotal} from '@helpers/marketplaceHelpers';
import {placeMarketplaceOrder} from '@redux/slices/marketplaceSlice';
import {transfer} from '@redux/slices/walletSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {MarketplaceOrder} from '@Types/marketplaceTypes';

type Props = {navigation: AppStackNavigationProp<'MarketplaceCheckout'>};

const PAYMENT_METHODS: MarketplaceOrder['paymentMethod'][] = ['wallet', 'card', 'cash'];

const MarketplaceCheckout = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {cart, products, promotions, merchantStore} = useAppSelector(state => state.marketplace);
  const walletBalance = useAppSelector(state => state.wallet.balance);
  const [address, setAddress] = useState(SEED_ADDRESSES[0]?.addressLine ?? '');
  const [paymentMethod, setPaymentMethod] = useState<MarketplaceOrder['paymentMethod']>('wallet');

  const subtotal = getCartSubtotal(cart, products, promotions);
  const total = subtotal + MARKETPLACE_DELIVERY_FEE;

  const placeOrder = () => {
    if (!merchantStore.isOpen) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.storeClosed'));
      return;
    }
    if (!address.trim()) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.addressRequired'));
      return;
    }
    if (paymentMethod === 'wallet' && walletBalance < total) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.insufficientWallet'));
      return;
    }
    dispatch(placeMarketplaceOrder({addressLine: address.trim(), paymentMethod}));
    if (paymentMethod === 'wallet') {
      dispatch(
        transfer({
          title: t('marketplace.walletPaymentTitle'),
          amount: total,
          note: t('marketplace.walletPaymentNote'),
        }),
      );
    }
    Alert.alert(t('marketplace.orderPlacedTitle'), t('marketplace.orderPlacedBody'));
    navigation.replace('MarketplaceOrders');
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.checkout')} navigation={navigation} />
      <TextInputView
        label={t('marketplace.deliveryAddress')}
        value={address}
        onChangeText={setAddress}
      />
      <Spacer size="md" />
      <TextView text={t('marketplace.paymentMethod')} variant="h3" />
      <Spacer size="sm" />
      {PAYMENT_METHODS.map(method => (
        <Button
          key={method}
          label={t(`marketplace.payment.${method}`)}
          variant={paymentMethod === method ? 'primary' : 'outline'}
          fullWidth
          onPress={() => setPaymentMethod(method)}
        />
      ))}
      <Spacer size="md" />
      <Card>
        <TextView text={t('marketplace.total', {amount: formatCurrency(total)})} variant="h3" />
        {paymentMethod === 'wallet' ? (
          <TextView
            text={t('marketplace.walletBalance', {amount: formatCurrency(walletBalance)})}
            variant="caption"
            muted
          />
        ) : null}
      </Card>
      <Spacer size="lg" />
      <Button label={t('marketplace.placeOrder')} fullWidth onPress={placeOrder} />
    </ScreenContainer>
  );
};

export default MarketplaceCheckout;
