import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveBottomSheetStyles} from './styles/resolveBottomSheetStyles';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Optional footer (e.g. primary action). */
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Lightweight modal bottom sheet — no extra native deps.
 * Use for language / theme pickers and similar choice sheets.
 */
const BottomSheet = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  contentStyle,
}: BottomSheetProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(resolveBottomSheetStyles);
  const translateY = useRef(new Animated.Value(320)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 320,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, {opacity}]}>
          <Pressable style={styles.backdropPress} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {paddingBottom: Math.max(insets.bottom, 16), transform: [{translateY}]},
            contentStyle,
          ]}>
          <View style={styles.handle} />
          {title ? (
            <View style={styles.header}>
              <Heading text={title} level="h3" />
              {subtitle ? (
                <TextView text={subtitle} variant="bodySmall" muted />
              ) : null}
            </View>
          ) : null}
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
