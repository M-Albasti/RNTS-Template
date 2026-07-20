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

import {formatCurrency} from '@helpers/locationHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveDeliveryHubStyles} from './styles/resolveDeliveryHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'DeliveryHub'>};

const DeliveryHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, sizes} = useThemeTokens();
  const {orders, driverMode} = useAppSelector(state => state.delivery);
  const activeCount = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  const styles = useThemedStyles(resolveDeliveryHubStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('delivery.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'new',
            iconName: 'add-circle-outline',
            onPress: () => navigation.navigate('NewDelivery'),
            accessibilityLabel: t('delivery.newDelivery'),
          },
          {
            key: 'history',
            iconName: 'time-outline',
            onPress: () => navigation.navigate('DeliveryHistory'),
            accessibilityLabel: t('delivery.orderHistory'),
          },
        ]}
      />
      <View style={styles.hero}>
        <TextView text={t('delivery.hubSubtitle')} variant="bodySmall" muted />
        <Heading text={t('delivery.activeCount', {count: activeCount})} level="h2" />
        <Pressable
          style={styles.searchBar}
          onPress={() => navigation.navigate('NewDelivery')}>
          <IconView
            iconType="Ionicons"
            name="search-outline"
            size={sizes.iconSm}
            color={colors.textMuted}
          />
          <TextView text={t('delivery.newDeliverySubtitle')} variant="bodySmall" muted />
        </Pressable>
        <View style={styles.modeChip}>
          <TextView
            text={driverMode ? t('delivery.driverModeOn') : t('delivery.customerMode')}
            variant="caption"
          />
        </View>
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
