import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {purchaseItem} from '@redux/slices/gameSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GameShopItem} from '@Types/gameTypes';

interface GameShopProps {
  navigation: AppStackNavigationProp<'GameShop'>;
}

const GameShop = ({navigation}: GameShopProps): React.JSX.Element => {
  const {coins, shopItems} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {...tokens.layout.presets.rowBetween},
      meta: {flex: tokens.layout.flex.fill, paddingRight: tokens.spacing.sm},
    }),
  );

  const renderItem = ({item}: {item: GameShopItem}) => (
    <Card>
      <View style={styles.row}>
        <View style={styles.meta}>
          <Heading text={item.title} level="h3" />
          <TextView text={item.description} variant="bodySmall" muted />
          <Spacer size="xs" />
          <TextView text={`${item.cost} coins`} variant="caption" />
        </View>
        <Button
          label="Buy"
          size="sm"
          disabled={coins < item.cost}
          onPress={() => dispatch(purchaseItem(item.id))}
        />
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Coin shop" onBack={() => navigation.goBack()} />
      <TextView text={`Balance: ${coins} coins`} variant="bodySmall" muted />
      <Spacer size="md" />
      <FlashList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default GameShop;
