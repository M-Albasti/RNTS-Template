import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveWalletHomeStyles} from './styles/resolveWalletHomeStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface WalletHomeProps {
  navigation: AppStackNavigationProp<'WalletHome'>;
}

const WalletHome = ({navigation}: WalletHomeProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, sizes} = useThemeTokens();
  const {balance, cardLast4, transactions, cards} = useAppSelector(state => state.wallet);
  const styles = useThemedStyles(resolveWalletHomeStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('wallet.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'transactions',
            iconName: 'receipt-outline',
            onPress: () => navigation.navigate('WalletTransactions'),
            accessibilityLabel: t('wallet.transactionsTitle'),
          },
          {
            key: 'qr',
            iconName: 'qr-code-outline',
            onPress: () => navigation.navigate('WalletQRPay'),
            accessibilityLabel: t('wallet.qrPay'),
          },
        ]}
      />
      <View style={styles.hero}>
        <TextView
          text={t('wallet.availableBalance')}
          variant="bodySmall"
          style={styles.heroMuted}
        />
        <Heading text={`$${balance.toFixed(2)}`} level="h1" style={styles.heroText} />
        <TextView
          text={t('wallet.cardSummary', {last4: cardLast4, count: cards.length})}
          variant="caption"
          style={styles.heroMuted}
        />
        <View style={styles.quickRow}>
          <Pressable style={styles.quickAction} onPress={() => navigation.navigate('WalletSend')}>
            <IconView iconType="Ionicons" name="send-outline" size={sizes.iconSm} color={colors.textInverse} />
            <TextView text={t('wallet.send')} variant="caption" style={styles.heroText} />
          </Pressable>
          <Pressable style={styles.quickAction} onPress={() => navigation.navigate('WalletTopUp')}>
            <IconView iconType="Ionicons" name="add-outline" size={sizes.iconSm} color={colors.textInverse} />
            <TextView text={t('wallet.topUp')} variant="caption" style={styles.heroText} />
          </Pressable>
          <Pressable style={styles.quickAction} onPress={() => navigation.navigate('WalletQRPay')}>
            <IconView iconType="Ionicons" name="qr-code-outline" size={sizes.iconSm} color={colors.textInverse} />
            <TextView text={t('wallet.qrPay')} variant="caption" style={styles.heroText} />
          </Pressable>
        </View>
      </View>
      <Spacer size="lg" />
      <Heading text={t('wallet.banking')} level="h3" />
      <Spacer size="sm" />
      <TextView
        text={t('wallet.transactionsCount', {count: transactions.length})}
        variant="caption"
        muted
      />
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
