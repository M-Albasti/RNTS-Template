import React from 'react';
import {FlatList, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import OrderStatusBadge from '@molecules/delivery/OrderStatusBadge';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'DeliveryHistory'>};

const DeliveryHistory = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const orders = useAppSelector(state =>
    state.delivery.orders.filter(o => ['delivered', 'cancelled'].includes(o.status)),
  );
  const styles = useThemedStyles(tokens => ({
    card: {gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.orderHistory')} onBack={() => navigation.goBack()} />
      {orders.length === 0 ? (
        <TextView text={t('delivery.noHistory')} align="center" muted />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable onPress={() => navigation.navigate('DeliveryDetail', {orderId: item.id})}>
              <Card style={styles.card}>
                <OrderStatusBadge
                  label={t(`delivery.status.${item.status}`)}
                  tone={item.status === 'delivered' ? 'success' : 'danger'}
                />
                <TextView text={`${item.pickup.label} → ${item.dropoff.label}`} variant="bodySmall" />
                <TextView text={formatCurrency(item.price)} variant="caption" muted />
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default DeliveryHistory;
