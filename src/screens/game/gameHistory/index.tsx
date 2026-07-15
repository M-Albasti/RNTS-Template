import React from 'react';
import {View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import EmptyView from '@atoms/EmptyView';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGameHistoryStyles} from './styles/resolveGameHistoryStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GameHistoryEntry} from '@Types/gameTypes';

interface GameHistoryProps {
  navigation: AppStackNavigationProp<'GameHistory'>;
}

const GameHistory = ({navigation}: GameHistoryProps): React.JSX.Element => {
  const {t} = useTranslation();
  const history = useAppSelector(state => state.game.history);
  const styles = useThemedStyles(resolveGameHistoryStyles);

  if (history.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('game.rewardHistory')} onBack={() => navigation.goBack()} />
        <EmptyView
          title={t('game.spinToEarn')}
          iconName="trophy-outline"
          actionLabel={t('game.luckySpinner')}
          onAction={() => navigation.navigate('LuckySpinner')}
        />
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
      <ScreenHeader title={t('game.rewardHistory')} onBack={() => navigation.goBack()} />
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
