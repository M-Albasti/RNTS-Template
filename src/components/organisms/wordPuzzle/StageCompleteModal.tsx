import React, {useEffect} from 'react';
import {Modal, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Button from '@atoms/Button';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  visible: boolean;
  hasNextMatch: boolean;
  onContinue: () => void;
};

const StageCompleteModal = ({visible, hasNextMatch, onContinue}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  const styles = useThemedStyles(tokens => ({
    backdrop: {
      flex: 1,
      backgroundColor: tokens.colors.overlay,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: tokens.spacing.xl,
    },
    card: {
      width: '100%' as const,
      maxWidth: 360,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.xl,
      alignItems: 'center' as const,
      ...tokens.shadows.md,
    },
    title: {
      fontSize: 24,
      fontWeight: '800' as const,
      color: tokens.colors.success,
      textAlign: 'center' as const,
    },
    body: {
      textAlign: 'center' as const,
      color: tokens.colors.textSecondary,
    },
  }));

  useEffect(() => {
    if (!visible) {
      return;
    }
    opacity.value = withTiming(1, {duration: 200});
    scale.value = withSpring(1, {damping: 14, stiffness: 180});
  }, [opacity, scale, visible]);

  const backdropStyle = useAnimatedStyle(() => ({opacity: opacity.value}));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Animated.View style={[styles.card, cardStyle]}>
          <TextView text={t('wordPuzzle.stageSuccessTitle')} style={styles.title} />
          <Spacer size="sm" />
          <TextView
            text={
              hasNextMatch
                ? t('wordPuzzle.stageSuccessBody')
                : t('wordPuzzle.bookCompleteBody')
            }
            variant="bodySmall"
            style={styles.body}
          />
          <Spacer size="lg" />
          <View style={{width: '100%'}}>
            <Button
              label={
                hasNextMatch
                  ? t('wordPuzzle.continueNextMatch')
                  : t('wordPuzzle.backToMap')
              }
              fullWidth
              onPress={onContinue}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default StageCompleteModal;
