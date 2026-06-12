import React from 'react';
import {StyleSheet, View} from 'react-native';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletHomeProps {
  navigation: AppStackNavigationProp<'WalletHome'>;
}

const WalletHome = ({navigation}: WalletHomeProps): React.JSX.Element => {
  const {balance, cardLast4, transactions, cards} = useAppSelector(state => state.wallet);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        backgroundColor: tokens.colors.primary,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        ...tokens.layout.presets.columnCenter,
      },
      heroText: {color: tokens.colors.textInverse},
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title="Wallet" showBack={false} />
      <View style={styles.hero}>
        <TextView text="Available balance" variant="bodySmall" style={styles.heroText} />
        <Spacer size="xs" />
        <Heading text={`$${balance.toFixed(2)}`} level="h1" align="center" />
        <Spacer size="xs" />
        <TextView
          text={`Card •••• ${cardLast4} · ${cards.length} cards`}
          variant="caption"
          align="center"
          style={styles.heroText}
        />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView
            text={`${transactions.length} transactions`}
            variant="caption"
            style={styles.heroText}
          />
        </View>
      </View>
      <Spacer size="lg" />
      <Heading text="Banking" level="h3" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="Send"
          subtitle="Transfer money"
          iconType="Ionicons"
          iconName="send-outline"
          onPress={() => navigation.navigate('WalletSend')}
        />
        <FeatureHubCard
          title="Top up"
          subtitle="Add funds"
          iconType="Ionicons"
          iconName="add-outline"
          onPress={() => navigation.navigate('WalletTopUp')}
        />
        <FeatureHubCard
          title="Cards"
          subtitle="Manage payment cards"
          iconType="Ionicons"
          iconName="card-outline"
          onPress={() => navigation.navigate('WalletCards')}
        />
        <FeatureHubCard
          title="History"
          subtitle="All transactions"
          iconType="Ionicons"
          iconName="list-outline"
          onPress={() => navigation.navigate('WalletTransactions')}
        />
        <FeatureHubCard
          title="Budget"
          subtitle="Spending & savings"
          iconType="Ionicons"
          iconName="pie-chart-outline"
          onPress={() => navigation.navigate('WalletBudget')}
        />
        <FeatureHubCard
          title="QR Pay"
          subtitle="Scan to pay"
          iconType="Ionicons"
          iconName="qr-code-outline"
          onPress={() => navigation.navigate('WalletQRPay')}
        />
        <FeatureHubCard
          title="Bills"
          subtitle="Pay utilities & rent"
          iconType="Ionicons"
          iconName="receipt-outline"
          onPress={() => navigation.navigate('WalletBills')}
        />
        <FeatureHubCard
          title="Request"
          subtitle="Accept money requests"
          iconType="Ionicons"
          iconName="download-outline"
          onPress={() => navigation.navigate('WalletRequest')}
        />
      </View>
    </ScreenContainer>
  );
};

export default WalletHome;
