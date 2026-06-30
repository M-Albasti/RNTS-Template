import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGameHubStyles} from './styles/resolveGameHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface GameHubProps {
  navigation: AppStackNavigationProp<'GameHub'>;
}

const GameHub = ({navigation}: GameHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {coins, spinCount, history} = useAppSelector(state => state.game);
  const styles = useThemedStyles(resolveGameHubStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('game.center')} showBack={false} />
      <View style={styles.hero}>
        <Heading text={t('game.luckyArcade')} level="h2" align="center" />
        <Spacer size="xs" />
        <TextView
          text={t('game.coinsSpins', {coins, spins: spinCount})}
          align="center"
          style={styles.heroText}
        />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView text={`${history.length} rewards logged`} variant="caption" style={styles.heroText} />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('game.spinner')}
          subtitle={t('game.spinnerSubtitle')}
          iconType="MaterialCommunityIcons"
          iconName="slot-machine"
          onPress={() => navigation.navigate('LuckySpinner')}
        />
        <FeatureHubCard
          title={t('game.shop')}
          subtitle={t('game.shopSubtitle')}
          iconType="Ionicons"
          iconName="cart-outline"
          onPress={() => navigation.navigate('GameShop')}
        />
        <FeatureHubCard
          title={t('game.leaderboard')}
          subtitle={t('game.leaderboardSubtitle')}
          iconType="Ionicons"
          iconName="podium-outline"
          onPress={() => navigation.navigate('GameLeaderboard')}
        />
        <FeatureHubCard
          title={t('game.history')}
          subtitle={t('game.historySubtitle')}
          iconType="Ionicons"
          iconName="time-outline"
          onPress={() => navigation.navigate('GameHistory')}
        />
        <FeatureHubCard
          title={t('game.achievements')}
          subtitle={t('game.achievementsSubtitle')}
          iconType="Ionicons"
          iconName="ribbon-outline"
          onPress={() => navigation.navigate('GameAchievements')}
        />
      </View>
    </ScreenContainer>
  );
};

export default GameHub;
