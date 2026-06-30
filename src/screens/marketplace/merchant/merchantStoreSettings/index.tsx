import React, {useState} from 'react';
import {Alert, Switch, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Rating from '@atoms/Rating';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {formatCurrency} from '@helpers/locationHelpers';
import {toggleMerchantStoreOpen, updateMerchantStore} from '@redux/slices/marketplaceSlice';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveMerchantStoreSettingsStyles} from './styles/resolveMerchantStoreSettingsStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'MerchantStoreSettings'>};

const MerchantStoreSettings = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const merchantStore = useAppSelector(state => state.marketplace.merchantStore);
  const [name, setName] = useState(merchantStore.name);
  const [description, setDescription] = useState(merchantStore.description);

  const styles = useThemedStyles(resolveMerchantStoreSettingsStyles);

  const save = () => {
    if (!name.trim()) {
      Alert.alert(t('marketplace.errorTitle'), t('marketplace.merchant.storeNameRequired'));
      return;
    }
    dispatch(updateMerchantStore({name: name.trim(), description: description.trim()}));
    Alert.alert(
      t('marketplace.merchant.storeSavedTitle'),
      t('marketplace.merchant.storeSavedBody'),
    );
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('marketplace.merchant.storeSettings')}
        onBack={() => navigation.goBack()}
      />
      <Card style={styles.settingsCard}>
        <View style={styles.row}>
          <TextView text={t('marketplace.merchant.acceptOrders')} variant="bodySmall" />
          <Switch
            value={merchantStore.isOpen}
            onValueChange={() => {
              dispatch(toggleMerchantStoreOpen());
            }}
          />
        </View>
        <TextView
          text={
            merchantStore.isOpen
              ? t('marketplace.merchant.acceptOrdersOn')
              : t('marketplace.merchant.acceptOrdersOff')
          }
          variant="caption"
          muted
        />
      </Card>
      <TextInputView
        label={t('marketplace.merchant.storeName')}
        value={name}
        onChangeText={setName}
      />
      <TextInputView
        label={t('marketplace.merchant.storeDescription')}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Spacer size="md" />
      <Card>
        <Rating
          value={merchantStore.rating}
          showValue
          reviewCount={merchantStore.reviewCount}
          sizeToken="md"
        />
        <Spacer size="sm" />
        <TextView
          text={t('marketplace.merchant.storeRevenue', {
            amount: formatCurrency(merchantStore.revenue),
          })}
          variant="bodySmall"
        />
        <TextView
          text={t('marketplace.merchant.storeFulfilled', {
            count: merchantStore.fulfilledOrders,
          })}
          variant="caption"
          muted
        />
      </Card>
      <Spacer size="lg" />
      <Button label={t('marketplace.merchant.saveStore')} fullWidth onPress={save} />
    </ScreenContainer>
  );
};

export default MerchantStoreSettings;
