import React, {useMemo, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {
  estimateDeliveryMinutes,
  estimateDeliveryPrice,
  formatCurrency,
} from '@helpers/locationHelpers';
import {createDeliveryOrderOnServer} from '@services/deliveryServices/deliveryOrderService';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {DeliveryAddress, DeliveryPackageType} from '@Types/deliveryTypes';

type Props = {navigation: AppStackNavigationProp<'NewDelivery'>};

const PACKAGE_TYPES: DeliveryPackageType[] = ['document', 'food', 'parcel', 'fragile'];

const NewDelivery = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const savedAddresses = useAppSelector(state => state.delivery.savedAddresses);
  const [pickupId, setPickupId] = useState(savedAddresses[0]?.id ?? '');
  const [dropoffId, setDropoffId] = useState(savedAddresses[1]?.id ?? savedAddresses[0]?.id ?? '');
  const [packageType, setPackageType] = useState<DeliveryPackageType>('parcel');
  const [notes, setNotes] = useState('');

  const pickup = savedAddresses.find(a => a.id === pickupId);
  const dropoff = savedAddresses.find(a => a.id === dropoffId);

  const quote = useMemo(() => {
    if (!pickup || !dropoff) {
      return null;
    }
    const eta = estimateDeliveryMinutes(pickup.coordinate, dropoff.coordinate);
    const price = estimateDeliveryPrice(eta, packageType);
    return {eta, price};
  }, [dropoff, packageType, pickup]);

  const styles = useThemedStyles(tokens => ({
    section: {gap: tokens.spacing.sm},
    chipRow: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    chipActive: {
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.surfaceSecondary,
    },
  }));

  const submit = () => {
    if (!pickup || !dropoff || !quote) {
      Alert.alert(t('delivery.errorTitle'), t('delivery.invalidAddresses'));
      return;
    }
    if (pickup.id === dropoff.id) {
      Alert.alert(t('delivery.errorTitle'), t('delivery.sameAddress'));
      return;
    }

    void createDeliveryOrderOnServer(dispatch, {
      pickup,
      dropoff,
      packageType,
      notes: notes.trim() || undefined,
      price: quote.price,
      etaMinutes: quote.eta,
    })
      .then(() => {
        Alert.alert(t('delivery.orderPlacedTitle'), t('delivery.orderPlacedBody'));
        navigation.replace('ActiveOrders');
      })
      .catch(() => Alert.alert(t('delivery.errorTitle'), t('delivery.createOrderFailed')));
  };

  const renderAddressPicker = (
    label: string,
    selectedId: string,
    onSelect: (id: string) => void,
  ) => (
    <View style={styles.section}>
      <TextView text={label} variant="h3" />
      {savedAddresses.map((address: DeliveryAddress) => (
        <Pressable key={address.id} onPress={() => onSelect(address.id)}>
          <Card
            elevated={false}
            style={selectedId === address.id ? styles.chipActive : styles.chip}>
            <TextView text={`${address.label} — ${address.addressLine}`} variant="bodySmall" />
          </Card>
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('delivery.newDelivery')} onBack={() => navigation.goBack()} />
      {renderAddressPicker(t('delivery.pickup'), pickupId, setPickupId)}
      <Spacer size="md" />
      {renderAddressPicker(t('delivery.dropoff'), dropoffId, setDropoffId)}
      <Spacer size="md" />
      <TextView text={t('delivery.packageType')} variant="h3" />
      <Spacer size="sm" />
      <View style={styles.chipRow}>
        {PACKAGE_TYPES.map(type => (
          <Pressable key={type} onPress={() => setPackageType(type)}>
            <TextView
              text={t(`delivery.package.${type}`)}
              style={[styles.chip, packageType === type && styles.chipActive]}
            />
          </Pressable>
        ))}
      </View>
      <Spacer size="md" />
      <TextInputView
        label={t('delivery.notes')}
        value={notes}
        onChangeText={setNotes}
        placeholder={t('delivery.notesPlaceholder')}
      />
      {quote ? (
        <>
          <Spacer size="md" />
          <Card>
            <TextView text={t('delivery.quoteTitle')} variant="h3" />
            <TextView text={t('delivery.quoteEta', {minutes: quote.eta})} variant="bodySmall" />
            <TextView text={formatCurrency(quote.price)} variant="h3" />
          </Card>
        </>
      ) : null}
      <Spacer size="lg" />
      <Button label={t('delivery.confirmOrder')} onPress={submit} fullWidth />
    </ScreenContainer>
  );
};

export default NewDelivery;
