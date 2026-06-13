import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setDefaultCard} from '@redux/slices/walletSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {WalletCard} from '@Types/walletTypes';

interface WalletCardsProps {
  navigation: AppStackNavigationProp<'WalletCards'>;
}

const WalletCards = ({navigation}: WalletCardsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const cards = useAppSelector(state => state.wallet.cards);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {...tokens.layout.presets.rowBetween},
      badge: {
        backgroundColor: tokens.colors.primaryMuted,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        borderRadius: tokens.radius.sm,
      },
    }),
  );

  const renderItem = ({item}: {item: WalletCard}) => (
    <Card>
      <View style={styles.row}>
        <View>
          <Heading text={item.label} level="h3" />
          <TextView text={`${item.brand} •••• ${item.last4}`} variant="bodySmall" muted />
        </View>
        {item.isDefault ? (
          <View style={styles.badge}>
            <TextView text={t('wallet.defaultCard')} variant="caption" />
          </View>
        ) : (
          <Button
            label={t('wallet.setDefault')}
            size="sm"
            variant="outline"
            onPress={() => dispatch(setDefaultCard(item.id))}
          />
        )}
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('wallet.myCards')} onBack={() => navigation.goBack()} />
      <FlashList
        data={cards}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default WalletCards;
