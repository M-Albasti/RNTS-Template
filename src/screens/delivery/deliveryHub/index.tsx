import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'DeliveryHub'>};

const DeliveryHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {orders, driverMode} = useAppSelector(state => state.delivery);
  const activeCount = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      ...tokens.layout.presets.columnCenter,
    },
    heroText: {color: tokens.colors.textInverse},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.title')} showBack={false} />
      <View style={styles.hero}>
        <TextView text={t('delivery.hubSubtitle')} variant="bodySmall" style={styles.heroText} />
        <Spacer size="xs" />
        <Heading text={t('delivery.activeCount', {count: activeCount})} level="h2" align="center" />
        <Spacer size="xs" />
        <TextView
          text={driverMode ? t('delivery.driverModeOn') : t('delivery.customerMode')}
          variant="caption"
          style={styles.heroText}
        />
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('delivery.newDelivery')}
          subtitle={t('delivery.newDeliverySubtitle')}
          iconType="Ionicons"
          iconName="add-circle-outline"
          onPress={() => navigation.navigate('NewDelivery')}
        />
        <FeatureHubCard
          title={t('delivery.trackOrder')}
          subtitle={t('delivery.trackOrderSubtitle')}
          iconType="Ionicons"
          iconName="navigate-outline"
          onPress={() => navigation.navigate('ActiveOrders')}
        />
        <FeatureHubCard
          title={t('delivery.orderHistory')}
          subtitle={t('delivery.orderHistorySubtitle')}
          iconType="Ionicons"
          iconName="time-outline"
          onPress={() => navigation.navigate('DeliveryHistory')}
        />
        <FeatureHubCard
          title={t('delivery.driverPanel')}
          subtitle={t('delivery.driverPanelSubtitle')}
          iconType="MaterialCommunityIcons"
          iconName="motorbike"
          onPress={() => navigation.navigate('DeliveryDriver')}
        />
      </View>
      <Spacer size="md" />
      <TextView
        text={t('delivery.samplePrice', {price: formatCurrency(18.5)})}
        variant="caption"
        muted
      />
    </ScreenContainer>
  );
};

export default DeliveryHub;
