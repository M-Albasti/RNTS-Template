import React, {useEffect} from 'react';
import {Modal, Pressable} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  text: string | null;
  onDismiss: () => void;
};

const PraiseOverlay = ({text, onDismiss}: Props): React.JSX.Element | null => {
  const scale = useSharedValue(0.55);
  const opacity = useSharedValue(0);
  const backdrop = useSharedValue(0);
  const rotate = useSharedValue(-6);

  const styles = useThemedStyles(tokens => ({
    backdrop: {
      flex: 1,
      backgroundColor: tokens.colors.overlay,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: tokens.spacing.xl,
    },
    bubble: {
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
      borderRadius: tokens.radius.xl,
      backgroundColor: tokens.colors.surface,
      ...tokens.shadows.md,
      maxWidth: '88%' as const,
    },
    text: {
      fontSize: 30,
      fontWeight: '800' as const,
      color: tokens.colors.primary,
      textAlign: 'center' as const,
    },
  }));

  useEffect(() => {
    if (!text) {
      return undefined;
    }
    backdrop.value = withTiming(1, {duration: 200});
    opacity.value = withTiming(1, {duration: 180});
    rotate.value = withSequence(
      withSpring(4, {damping: 10, stiffness: 220}),
      withSpring(0, {damping: 12, stiffness: 180}),
    );
    scale.value = withSequence(
      withSpring(1.12, {damping: 11, stiffness: 240}),
      withSpring(1, {damping: 14, stiffness: 180}),
    );
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, {duration: 220, easing: Easing.in(Easing.cubic)});
      backdrop.value = withTiming(0, {duration: 240});
      scale.value = withTiming(0.9, {duration: 220});
      setTimeout(onDismiss, 240);
    }, 1250);
    return () => clearTimeout(timer);
  }, [backdrop, onDismiss, opacity, rotate, scale, text]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}, {rotate: `${rotate.value}deg`}],
  }));

  if (!text) {
    return null;
  }

  return (
    <Modal transparent animationType="none" visible onRequestClose={onDismiss}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={onDismiss}>
          <Animated.View style={[styles.bubble, bubbleStyle]}>
            <TextView text={text} style={styles.text} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

export default PraiseOverlay;
