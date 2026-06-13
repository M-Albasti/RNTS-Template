import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();
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
      <ScreenHeader title={t('wallet.title')} showBack={false} />
      <View style={styles.hero}>
        <TextView text={t('wallet.availableBalance')} variant="bodySmall" style={styles.heroText} />
        <Spacer size="xs" />
        <Heading text={`$${balance.toFixed(2)}`} level="h1" align="center" />
        <Spacer size="xs" />
        <TextView
          text={t('wallet.cardSummary', {last4: cardLast4, count: cards.length})}
          variant="caption"
          align="center"
          style={styles.heroText}
        />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView
            text={t('wallet.transactionsCount', {count: transactions.length})}
            variant="caption"
            style={styles.heroText}
          />
        </View>
      </View>
      <Spacer size="lg" />
      <Heading text={t('wallet.banking')} level="h3" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('wallet.send')}
          subtitle={t('wallet.sendSubtitle')}
          iconType="Ionicons"
          iconName="send-outline"
          onPress={() => navigation.navigate('WalletSend')}
        />
        <FeatureHubCard
          title={t('wallet.topUp')}
          subtitle={t('wallet.topUpSubtitle')}
          iconType="Ionicons"
          iconName="add-outline"
          onPress={() => navigation.navigate('WalletTopUp')}
        />
        <FeatureHubCard
          title={t('wallet.cards')}
          subtitle={t('wallet.cardsSubtitle')}
          iconType="Ionicons"
          iconName="card-outline"
          onPress={() => navigation.navigate('WalletCards')}
        />
        <FeatureHubCard
          title={t('wallet.history')}
          subtitle={t('wallet.historySubtitle')}
          iconType="Ionicons"
          iconName="list-outline"
          onPress={() => navigation.navigate('WalletTransactions')}
        />
        <FeatureHubCard
          title={t('wallet.budget')}
          subtitle={t('wallet.budgetSubtitle')}
          iconType="Ionicons"
          iconName="pie-chart-outline"
          onPress={() => navigation.navigate('WalletBudget')}
        />
        <FeatureHubCard
          title={t('wallet.qrPay')}
          subtitle={t('wallet.qrPaySubtitle')}
          iconType="Ionicons"
          iconName="qr-code-outline"
          onPress={() => navigation.navigate('WalletQRPay')}
        />
        <FeatureHubCard
          title={t('wallet.bills')}
          subtitle={t('wallet.billsSubtitle')}
          iconType="Ionicons"
          iconName="receipt-outline"
          onPress={() => navigation.navigate('WalletBills')}
        />
        <FeatureHubCard
          title={t('wallet.request')}
          subtitle={t('wallet.requestSubtitle')}
          iconType="Ionicons"
          iconName="download-outline"
          onPress={() => navigation.navigate('WalletRequest')}
        />
      </View>
    </ScreenContainer>
  );
};

export default WalletHome;
