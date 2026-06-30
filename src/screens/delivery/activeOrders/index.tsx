import React from 'react';
import {FlatList, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import OrderStatusBadge from '@molecules/delivery/OrderStatusBadge';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {isLiveTrackingStatus} from '@helpers/deliveryTrackingHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveActiveOrdersStyles} from './styles/resolveActiveOrdersStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'ActiveOrders'>;
};

const ActiveOrders = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const orders = useAppSelector(state =>
    state.delivery.orders.filter(o => !['delivered', 'cancelled'].includes(o.status)),
  );
  const styles = useThemedStyles(resolveActiveOrdersStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.activeOrders')} onBack={() => navigation.goBack()} />
      {orders.length === 0 ? (
        <TextView text={t('delivery.noActiveOrders')} align="center" muted />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable
              onPress={() => navigation.navigate('OrderTracking', {orderId: item.id})}>
              <Card style={styles.card}>
                <View style={styles.row}>
                  <TextView text={`#${item.id.slice(-4)}`} variant="h3" />
                  <View style={styles.badgeRow}>
                    {isLiveTrackingStatus(item.status) && item.driver ? (
                      <View style={styles.livePill}>
                        <TextView
                          text={t('delivery.live')}
                          variant="caption"
                          style={styles.liveText}
                        />
                      </View>
                    ) : null}
                    <OrderStatusBadge label={t(`delivery.status.${item.status}`)} />
                  </View>
                </View>
                <TextView text={item.pickup.label} variant="bodySmall" />
                <TextView text={`→ ${item.dropoff.label}`} variant="bodySmall" muted />
                <TextView
                  text={t('delivery.etaLine', {
                    minutes: item.etaMinutes,
                    price: formatCurrency(item.price),
                  })}
                  variant="caption"
                />
              </Card>
            </Pressable>
          )}
        />
      )}
      <Spacer size="md" />
    </ScreenContainer>
  );
};

export default ActiveOrders;
