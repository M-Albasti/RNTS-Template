import React, {useCallback} from 'react';
import {Pressable, type PressableProps, type StyleProp, type ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedScalePressable = ({
  children,
  style,
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  ...rest
}: Props): React.JSX.Element => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      scale.value = withSpring(scaleTo, {damping: 16, stiffness: 280});
      onPressIn?.(event);
    },
    [onPressIn, scale, scaleTo],
  );

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scale.value = withSpring(1, {damping: 14, stiffness: 240});
      onPressOut?.(event);
    },
    [onPressOut, scale],
  );

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      {children}
    </AnimatedPressable>
  );
};

export default AnimatedScalePressable;
