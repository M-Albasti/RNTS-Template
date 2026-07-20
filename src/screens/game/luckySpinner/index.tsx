import React, {useState} from 'react';
import {Dimensions, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {spin} from '@redux/slices/gameSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveLuckySpinnerStyles} from './styles/resolveLuckySpinnerStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

const SEGMENTS = ['+10', '+25', '+5', 'Again', '+50', 'Jackpot'];

interface LuckySpinnerProps {
  navigation: AppStackNavigationProp<'LuckySpinner'>;
}

const LuckySpinner = ({navigation}: LuckySpinnerProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {coins, lastReward, spinCount} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const rotation = useSharedValue(0);
  const [spinning, setSpinning] = useState(false);
  const styles = useThemedStyles(tokens => {
    const wheelSize = Math.min(tokens.sizes.spinner, Dimensions.get('window').width * 0.55);
    return {
      ...resolveLuckySpinnerStyles(tokens),
      wheel: {
        ...resolveLuckySpinnerStyles(tokens).wheel,
        width: wheelSize,
        height: wheelSize,
      },
    };
  });

  const finishSpin = () => {
    setSpinning(false);
    dispatch(spin());
  };

  const onSpin = () => {
    if (spinning) {
      return;
    }
    setSpinning(true);
    const extraTurns = 2 + Math.floor(Math.random() * 2);
    const landing = Math.floor(Math.random() * 360);
    const next = rotation.value + 360 * extraTurns + landing;
    rotation.value = withTiming(
      next,
      {duration: 2200, easing: Easing.out(Easing.cubic)},
      finished => {
        if (finished) {
          runOnJS(finishSpin)();
        }
      },
    );
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <ScreenContainer scroll centered alignContent="center" bottomPadding="xxl">
      <ScreenHeader title={t('game.luckySpinner')} navigation={navigation} />
      <Card constrained>
        <View style={styles.stats}>
          <Heading text={t('game.coinsCount', {count: coins})} level="h2" align="center" />
          <TextView
            text={t('game.spinsCount', {count: spinCount})}
            variant="bodySmall"
            muted
            align="center"
          />
        </View>
        <Spacer size="lg" />
        <Animated.View style={[styles.wheel, wheelStyle]}>
          <Heading text={t('game.spinLabel')} level="h2" align="center" />
        </Animated.View>
        <Spacer size="md" />
        <View style={styles.segmentRow}>
          {SEGMENTS.map(label => (
            <View key={label} style={styles.segment}>
              <TextView text={label} variant="caption" align="center" />
            </View>
          ))}
        </View>
        <Spacer size="lg" />
        {lastReward ? (
          <>
            <TextView text={t('game.lastReward', {reward: lastReward})} align="center" />
            <Spacer size="md" />
          </>
        ) : null}
        <Button
          label={t('game.spinTheWheel')}
          fullWidth
          loading={spinning}
          disabled={spinning}
          onPress={onSpin}
        />
        <Spacer size="md" />
        <View style={styles.links}>
          <Button
            label={t('game.coinShop')}
            variant="secondary"
            fullWidth
            onPress={() => navigation.navigate('GameShop')}
          />
          <Button
            label={t('game.leaderboard')}
            variant="outline"
            fullWidth
            onPress={() => navigation.navigate('GameLeaderboard')}
          />
          <Button
            label={t('game.rewardHistory')}
            variant="ghost"
            fullWidth
            onPress={() => navigation.navigate('GameHistory')}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
};

export default LuckySpinner;
