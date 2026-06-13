import React, {useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
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
import {spin} from '@redux/slices/gameSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

const SEGMENTS = ['+10', '+25', '+5', 'Again', '+50', 'Jackpot'];

interface LuckySpinnerProps {
  navigation: AppStackNavigationProp<'LuckySpinner'>;
}

const LuckySpinner = ({navigation}: LuckySpinnerProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {coins, lastReward, spinCount} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const rotation = useRef(new Animated.Value(0)).current;
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      wheel: {
        width: 220,
        height: 220,
        borderRadius: tokens.radius.full,
        borderWidth: tokens.layout.borderWidth.lg,
        borderColor: tokens.colors.primary,
        ...tokens.layout.presets.selfCenter,
        ...tokens.layout.presets.center,
        backgroundColor: tokens.colors.surfaceSecondary,
      },
      segmentRow: {
        ...tokens.layout.presets.wrapRow,
        ...tokens.layout.presets.rowCenter,
        gap: tokens.spacing.xs,
      },
      segment: {
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        borderRadius: tokens.radius.sm,
        backgroundColor: tokens.colors.primaryMuted,
      },
      stats: {
        ...tokens.layout.presets.columnCenter,
        gap: tokens.spacing.xs,
      },
      links: {gap: tokens.spacing.sm},
    }),
  );

  const onSpin = () => {
    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => dispatch(spin()));
  };

  const spinInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${720 + Math.floor(Math.random() * 360)}deg`],
  });

  return (
    <ScreenContainer scroll centered alignContent="center" bottomPadding="xxl">
      <ScreenHeader title={t('game.luckySpinner')} onBack={() => navigation.goBack()} />
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
        <Animated.View style={[styles.wheel, {transform: [{rotate: spinInterpolate}]}]}>
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
        <Button label={t('game.spinTheWheel')} fullWidth onPress={onSpin} />
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
