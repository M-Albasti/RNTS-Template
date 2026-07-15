import React, {useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  delay?: number;
  entering?: 'up' | 'down';
};

const AnimatedEntrance = ({
  children,
  delay = 0,
  entering = 'up',
}: Props): React.JSX.Element => {
  const base =
    entering === 'down'
      ? FadeInDown.delay(delay).duration(420).easing(Easing.out(Easing.cubic))
      : FadeInUp.delay(delay).duration(420).easing(Easing.out(Easing.cubic));

  return <Animated.View entering={base.springify().damping(16).stiffness(160)}>{children}</Animated.View>;
};

export const AnimatedPulse = ({children}: {children: React.ReactNode}): React.JSX.Element => {
  const pulse = useSharedValue(1);
  const reduceMotion = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (!mounted) {
          return;
        }
        reduceMotion.value = enabled ? 1 : 0;
        if (enabled) {
          pulse.value = 1;
          return;
        }
        pulse.value = withRepeat(
          withSequence(
            withTiming(1.03, {duration: 1100, easing: Easing.inOut(Easing.quad)}),
            withTiming(1, {duration: 1100, easing: Easing.inOut(Easing.quad)}),
          ),
          -1,
          false,
        );
      })
      .catch(() => {
        pulse.value = withRepeat(
          withSequence(withTiming(1.03, {duration: 1100}), withTiming(1, {duration: 1100})),
          -1,
          false,
        );
      });

    return () => {
      mounted = false;
    };
  }, [pulse, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{scale: pulse.value}],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

export default AnimatedEntrance;
