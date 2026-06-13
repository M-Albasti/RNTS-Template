import React, {useEffect} from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';

export type RatingSize = 'sm' | 'md' | 'lg' | 'xl';

export type RatingProps = {
  value: number;
  maxStars?: number;
  size?: number;
  sizeToken?: RatingSize;
  showValue?: boolean;
  reviewCount?: number;
  precision?: number;
  interactive?: boolean;
  allowHalf?: boolean;
  animated?: boolean;
  onChange?: (value: number) => void;
};

export const clampRating = (value: number, maxStars: number): number =>
  Math.max(0, Math.min(maxStars, value));

/** Fill ratio 0–1 for a star slot (0 = first star). Supports averages like 4.2 or 2.1. */
export const getStarFillAmount = (
  rating: number,
  starIndex: number,
  maxStars = 5,
): number => {
  const normalized = clampRating(rating, maxStars);
  return Math.max(0, Math.min(1, normalized - starIndex));
};

export const formatAverageRating = (value: number, precision = 1): string =>
  clampRating(value, 5).toFixed(precision);

type RatingStarProps = {
  fill: number;
  size: number;
  index: number;
  animated: boolean;
  interactive: boolean;
  allowHalf: boolean;
  onSelect?: (value: number) => void;
};

const RatingStar = ({
  fill,
  size,
  index,
  animated,
  interactive,
  allowHalf,
  onSelect,
}: RatingStarProps): React.JSX.Element => {
  const tokens = useThemeTokens();
  const {animation} = tokens.rating;
  const fillWidth = useSharedValue(animated ? 0 : fill * size);
  const scale = useSharedValue(1);

  const styles = useThemedStyles(t => ({
    fillClip: {
      ...t.layout.presets.clipOverlayTopLeft,
    },
  }));

  useEffect(() => {
    const target = fill * size;
    fillWidth.value = animated
      ? withDelay(
          index * animation.staggerMs,
          withSpring(target, animation.spring),
        )
      : target;
  }, [animated, animation.spring, animation.staggerMs, fill, fillWidth, index, size]);

  const fillStyle = useAnimatedStyle(() => ({
    width: fillWidth.value,
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePress = (event: {nativeEvent: {locationX: number}}) => {
    if (!interactive || !onSelect) {
      return;
    }
    const halfValue = index + 0.5;
    const fullValue = index + 1;
    const next =
      allowHalf && event.nativeEvent.locationX < size / 2 ? halfValue : fullValue;
    scale.value = withSequence(
      withSpring(animation.pressScale, animation.pressSpring),
      withSpring(1, animation.spring),
    );
    onSelect(next);
  };

  const starBody = (
    <Animated.View style={[{width: size, height: size}, starStyle]}>
      <IconView
        iconType="Ionicons"
        name="star-outline"
        size={size}
        color={tokens.colors.ratingStarEmpty}
      />
      <Animated.View
        style={[styles.fillClip, {height: size}, fillStyle]}
        pointerEvents="none">
        <IconView
          iconType="Ionicons"
          name="star"
          size={size}
          color={tokens.colors.ratingStar}
        />
      </Animated.View>
    </Animated.View>
  );

  if (interactive && onSelect) {
    return (
      <Pressable
        onPress={handlePress}
        hitSlop={tokens.spacing.sm}
        accessibilityRole="button"
        accessibilityLabel={`${index + 1} stars`}>
        {starBody}
      </Pressable>
    );
  }

  return starBody;
};

const Rating = ({
  value,
  maxStars = 5,
  size,
  sizeToken = 'md',
  showValue = false,
  reviewCount,
  precision = 1,
  interactive = false,
  allowHalf = true,
  animated = true,
  onChange,
}: RatingProps): React.JSX.Element => {
  const tokens = useThemeTokens();
  const resolvedSize = size ?? tokens.rating.size[sizeToken];
  const normalized = clampRating(value, maxStars);

  const styles = useThemedStyles(t => ({
    row: {
      ...t.layout.presets.row,
      gap: t.spacing.xs,
    },
    stars: {
      ...t.layout.presets.row,
      gap: t.rating.starGap,
    },
  }));

  return (
    <View style={styles.row}>
      <View style={styles.stars}>
        {Array.from({length: maxStars}, (_, index) => (
          <RatingStar
            key={index}
            index={index}
            fill={getStarFillAmount(normalized, index, maxStars)}
            size={resolvedSize}
            animated={animated}
            interactive={interactive}
            allowHalf={allowHalf}
            onSelect={onChange}
          />
        ))}
      </View>
      {showValue ? (
        <TextView text={formatAverageRating(normalized, precision)} variant="caption" />
      ) : null}
      {reviewCount !== undefined ? (
        <TextView text={`(${reviewCount})`} variant="caption" muted />
      ) : null}
    </View>
  );
};

export default Rating;
