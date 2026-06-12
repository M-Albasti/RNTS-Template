import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GameHub from '@screens/game/gameHub';
import LuckySpinner from '@screens/game/luckySpinner';
import GameShop from '@screens/game/gameShop';
import GameLeaderboard from '@screens/game/gameLeaderboard';
import GameHistory from '@screens/game/gameHistory';
import GameAchievements from '@screens/game/gameAchievements';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const GameStack = createNativeStackNavigator<RootStackParamList>();

const GameNavigator = (): React.JSX.Element => {
  return (
    <GameStack.Navigator
      initialRouteName="GameHub"
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense fallback={<TextView text={'Loading...'} style={styles.fallbackText} containerStyle={styles.fallback} />}>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <GameStack.Screen name="GameHub" component={GameHub} />
      <GameStack.Screen name="LuckySpinner" component={LuckySpinner} />
      <GameStack.Screen name="GameShop" component={GameShop} />
      <GameStack.Screen name="GameLeaderboard" component={GameLeaderboard} />
      <GameStack.Screen name="GameHistory" component={GameHistory} />
      <GameStack.Screen name="GameAchievements" component={GameAchievements} />
    </GameStack.Navigator>
  );
};

export default GameNavigator;
