import React from 'react';
import {Pressable} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {getMerchantOrderTotal, getMerchantOrders} from '@helpers/marketplaceHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMerchantOrdersStyles} from './styles/resolveMerchantOrdersStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MerchantOrders'>};

const MerchantOrders = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveMerchantOrdersStyles);
  const orders = useAppSelector(state => state.marketplace.orders);
  const merchantOrders = getMerchantOrders(orders);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('marketplace.merchant.orders')} navigation={navigation} />
      {merchantOrders.length === 0 ? (
        <TextView text={t('marketplace.merchant.noOrders')} align="center" muted />
      ) : (
        <FlashList
          data={merchantOrders}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable onPress={() => navigation.navigate('MerchantOrderDetail', {orderId: item.id})}>
              <Card style={styles.card}>
                <TextView text={`#${item.id}`} variant="caption" muted />
                <TextView
                  text={t(`marketplace.status.${item.status}`)}
                  variant="h3"
                />
                <TextView
                  text={formatCurrency(getMerchantOrderTotal(item))}
                  variant="bodySmall"
                />
                <TextView text={item.addressLine} variant="caption" muted numberOfLines={1} />
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default MerchantOrders;
