import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WalletHome from '@screens/wallet/walletHome';
import WalletTransactions from '@screens/wallet/walletTransactions';
import WalletSend from '@screens/wallet/walletSend';
import WalletCards from '@screens/wallet/walletCards';
import WalletTopUp from '@screens/wallet/walletTopUp';
import WalletBudget from '@screens/wallet/walletBudget';
import WalletQRPay from '@screens/wallet/walletQRPay';
import WalletBills from '@screens/wallet/walletBills';
import WalletRequest from '@screens/wallet/walletRequest';
import TransactionDetail from '@screens/wallet/transactionDetail';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const WalletStack = createNativeStackNavigator<RootStackParamList>();

const WalletNavigator = (): React.JSX.Element => {
  return (
    <WalletStack.Navigator
      initialRouteName="WalletHome"
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense fallback={<TextView text={'Loading...'} style={styles.fallbackText} containerStyle={styles.fallback} />}>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <WalletStack.Screen name="WalletHome" component={WalletHome} />
      <WalletStack.Screen name="WalletTransactions" component={WalletTransactions} />
      <WalletStack.Screen name="WalletSend" component={WalletSend} />
      <WalletStack.Screen name="WalletCards" component={WalletCards} />
      <WalletStack.Screen name="WalletTopUp" component={WalletTopUp} />
      <WalletStack.Screen name="WalletBudget" component={WalletBudget} />
      <WalletStack.Screen name="WalletQRPay" component={WalletQRPay} />
      <WalletStack.Screen name="WalletBills" component={WalletBills} />
      <WalletStack.Screen name="WalletRequest" component={WalletRequest} />
      <WalletStack.Screen name="TransactionDetail" component={TransactionDetail} />
    </WalletStack.Navigator>
  );
};

export default WalletNavigator;
