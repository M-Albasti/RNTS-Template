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
import {resolveMarketplaceOrdersStyles} from './styles/resolveMarketplaceOrdersStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MarketplaceOrders'>};

const MarketplaceOrders = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const orders = useAppSelector(state => state.marketplace.orders);
  const styles = useThemedStyles(resolveMarketplaceOrdersStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.myOrders')} onBack={() => navigation.goBack()} />
      {orders.length === 0 ? (
        <TextView text={t('marketplace.noOrders')} align="center" muted />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('MarketplaceOrderDetail', {orderId: item.id})
              }>
              <Card style={styles.card}>
                <OrderStatusBadge label={t(`marketplace.status.${item.status}`)} />
                <TextView text={`#${item.id.slice(-4)} · ${item.items.length} ${t('marketplace.items')}`} />
                <TextView text={formatCurrency(item.total)} variant="h3" />
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default MarketplaceOrders;
