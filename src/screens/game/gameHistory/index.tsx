import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GameHistoryEntry} from '@Types/gameTypes';

interface GameHistoryProps {
  navigation: AppStackNavigationProp<'GameHistory'>;
}

const GameHistory = ({navigation}: GameHistoryProps): React.JSX.Element => {
  const history = useAppSelector(state => state.game.history);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {...tokens.layout.presets.rowBetween},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
      gain: {color: tokens.colors.success},
      loss: {color: tokens.colors.error},
    }),
  );

  if (history.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Reward history" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <TextView text="Spin the wheel to start earning rewards." muted align="center" />
        </View>
      </ScreenContainer>
    );
  }

  const renderItem = ({item}: {item: GameHistoryEntry}) => (
    <Card>
      <View style={styles.row}>
        <TextView text={item.reward} variant="body" />
        <TextView
          text={`${item.coinsDelta >= 0 ? '+' : ''}${item.coinsDelta}`}
          variant="bodySmall"
          style={item.coinsDelta >= 0 ? styles.gain : styles.loss}
        />
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Reward history" onBack={() => navigation.goBack()} />
      <FlashList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default GameHistory;
