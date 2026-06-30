import React, {useEffect} from 'react';
import Animated, {
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
  const enteringAnimation =
    entering === 'down' ? FadeInDown.delay(delay).springify() : FadeInUp.delay(delay).springify();

  return <Animated.View entering={enteringAnimation}>{children}</Animated.View>;
};

export const AnimatedPulse = ({children}: {children: React.ReactNode}): React.JSX.Element => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.04, {duration: 900}), withTiming(1, {duration: 900})),
      -1,
      false,
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [{scale: pulse.value}],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

export default AnimatedEntrance;
