import React from 'react';
import {View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import AnimatedEntrance from '@atoms/AnimatedEntrance';
import {AnimatedPulse} from '@atoms/AnimatedEntrance';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';
import {resolveGameHubStyles} from './styles/resolveGameHubStyles';

interface GameHubProps {
  navigation: AppStackNavigationProp<'GameHub'>;
}

const GameHub = ({navigation}: GameHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {coins, spinCount, history} = useAppSelector(state => state.game);
  const styles = useThemedStyles(resolveGameHubStyles);

  const drawerNav = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('game.center')} showBack={false} showDrawer navigation={navigation} />
      <AnimatedPulse>
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
      </AnimatedPulse>
      <Spacer size="lg" />
      <View style={styles.grid}>
        {[
          {title: t('game.spinner'), subtitle: t('game.spinnerSubtitle'), icon: 'slot-machine', route: 'LuckySpinner' as const, type: 'MaterialCommunityIcons' as const},
          {title: t('game.shop'), subtitle: t('game.shopSubtitle'), icon: 'cart-outline', route: 'GameShop' as const, type: 'Ionicons' as const},
          {title: t('game.leaderboard'), subtitle: t('game.leaderboardSubtitle'), icon: 'podium-outline', route: 'GameLeaderboard' as const, type: 'Ionicons' as const},
          {title: t('game.history'), subtitle: t('game.historySubtitle'), icon: 'time-outline', route: 'GameHistory' as const, type: 'Ionicons' as const},
          {title: t('game.wordPuzzle'), subtitle: t('game.wordPuzzleSubtitle'), icon: 'grid-outline', route: 'WordPuzzleStack' as const, type: 'Ionicons' as const},
          {title: t('game.achievements'), subtitle: t('game.achievementsSubtitle'), icon: 'ribbon-outline', route: 'GameAchievements' as const, type: 'Ionicons' as const},
        ].map((item, index) => (
          <AnimatedEntrance key={item.route} delay={index * 50}>
            <FeatureHubCard
              title={item.title}
              subtitle={item.subtitle}
              iconType={item.type}
              iconName={item.icon}
              onPress={() => {
                if (item.route === 'WordPuzzleStack') {
                  drawerNav?.navigate('WordPuzzleStack');
                  return;
                }
                navigation.navigate(item.route);
              }}
            />
          </AnimatedEntrance>
        ))}
      </View>
    </ScreenContainer>
  );
};

export default GameHub;
