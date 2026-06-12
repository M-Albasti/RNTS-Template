import React from 'react';
import {StyleSheet, View} from 'react-native';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface GameHubProps {
  navigation: AppStackNavigationProp<'GameHub'>;
}

const GameHub = ({navigation}: GameHubProps): React.JSX.Element => {
  const {coins, spinCount, history} = useAppSelector(state => state.game);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.accent2,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
      },
      heroText: {color: tokens.colors.textInverse},
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title="Game center" showBack={false} />
      <View style={styles.hero}>
        <Heading text="Lucky arcade" level="h2" align="center" />
        <Spacer size="xs" />
        <TextView text={`${coins} coins · ${spinCount} spins played`} align="center" style={styles.heroText} />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView text={`${history.length} rewards logged`} variant="caption" style={styles.heroText} />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="Spinner"
          subtitle="Spin the lucky wheel"
          iconType="MaterialCommunityIcons"
          iconName="slot-machine"
          onPress={() => navigation.navigate('LuckySpinner')}
        />
        <FeatureHubCard
          title="Shop"
          subtitle="Spend coins on boosts"
          iconType="Ionicons"
          iconName="cart-outline"
          onPress={() => navigation.navigate('GameShop')}
        />
        <FeatureHubCard
          title="Leaderboard"
          subtitle="Top players ranking"
          iconType="Ionicons"
          iconName="podium-outline"
          onPress={() => navigation.navigate('GameLeaderboard')}
        />
        <FeatureHubCard
          title="History"
          subtitle="Your reward log"
          iconType="Ionicons"
          iconName="time-outline"
          onPress={() => navigation.navigate('GameHistory')}
        />
        <FeatureHubCard
          title="Achievements"
          subtitle="Badges & daily bonus"
          iconType="Ionicons"
          iconName="ribbon-outline"
          onPress={() => navigation.navigate('GameAchievements')}
        />
      </View>
    </ScreenContainer>
  );
};

export default GameHub;
