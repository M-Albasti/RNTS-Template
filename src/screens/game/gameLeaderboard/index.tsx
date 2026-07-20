import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {syncLeaderboard} from '@redux/slices/gameSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGameLeaderboardStyles} from './styles/resolveGameLeaderboardStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {LeaderboardEntry} from '@Types/gameTypes';

interface GameLeaderboardProps {
  navigation: AppStackNavigationProp<'GameLeaderboard'>;
}

const GameLeaderboard = ({navigation}: GameLeaderboardProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {leaderboard, coins} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveGameLeaderboardStyles);

  useEffect(() => {
    dispatch(syncLeaderboard(coins));
  }, [coins, dispatch]);

  const renderItem = ({item}: {item: LeaderboardEntry}) => (
    <Card style={item.name === 'You' ? styles.highlight : undefined}>
      <View style={styles.row}>
        <TextView text={`#${item.rank}`} style={styles.rank} />
        <Heading text={item.name === 'You' ? t('game.you') : item.name} level="h3" />
        <TextView text={t('game.playerCoins', {count: item.coins})} variant="bodySmall" />
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('game.leaderboard')} navigation={navigation} />
      <FlashList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default GameLeaderboard;
