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
import {claimDailyReward} from '@redux/slices/gameSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGameAchievementsStyles} from './styles/resolveGameAchievementsStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GameAchievement} from '@Types/gameTypes';

interface GameAchievementsProps {
  navigation: AppStackNavigationProp<'GameAchievements'>;
}

const GameAchievements = ({navigation}: GameAchievementsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const achievements = useAppSelector(state => state.game.achievements);
  const lastDaily = useAppSelector(state => state.game.lastDailyClaim);
  const dispatch = useAppDispatch();
  const today = new Date().toISOString().slice(0, 10);
  const styles = useThemedStyles(resolveGameAchievementsStyles);

  const renderItem = ({item}: {item: GameAchievement}) => (
    <Card style={!item.unlocked ? styles.locked : undefined}>
      <View style={styles.row}>
        <View>
          <Heading text={item.title} level="h3" />
          <TextView text={item.description} variant="bodySmall" muted />
        </View>
        <TextView
          text={item.unlocked ? t('game.unlocked') : t('game.locked')}
          variant="caption"
        />
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('game.achievements')} onBack={() => navigation.goBack()} />
      <Button
        label={lastDaily === today ? t('game.dailyClaimed') : t('game.claimDaily')}
        fullWidth
        disabled={lastDaily === today}
        onPress={() => dispatch(claimDailyReward())}
      />
      <Spacer size="md" />
      <FlashList
        data={achievements}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default GameAchievements;
