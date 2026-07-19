import React, {useMemo} from 'react';
import {View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  /** 0–1 progress through the day (local time). */
  dayProgress: number;
};

/** Point on the same quadratic Bézier used by the rendered sun-path stroke. */
const pointOnSunPath = (
  t: number,
  width: number,
  height: number,
): {x: number; y: number} => {
  const p0x = 16;
  const p0y = height * 0.7;
  const p1x = width / 2;
  const p1y = height * 0.05;
  const p2x = width - 16;
  const p2y = height * 0.7;
  const mt = 1 - t;
  return {
    x: mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x,
    y: mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y,
  };
};

/**
 * Lightweight sun-path arc for the prayer hero — decorative progress cue.
 */
const PrayerSunPath = ({dayProgress}: Props): React.JSX.Element => {
  const {colors, spacing} = useThemeTokens();
  const styles = useThemedStyles(tokens => ({
    wrap: {
      height: tokens.spacing.xxxl + tokens.spacing.lg,
      marginVertical: tokens.spacing.sm,
    },
  }));

  const width = 320;
  const height = spacing.xxxl + spacing.lg;
  const progress = Math.min(1, Math.max(0, dayProgress));

  const markers = useMemo(() => [0.12, 0.28, 0.45, 0.62, 0.78, 0.9], []);
  const sun = pointOnSunPath(progress, width, height);

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={`M 16 ${height * 0.7} Q ${width / 2} ${height * 0.05} ${width - 16} ${height * 0.7}`}
          stroke={colors.prayerAccent}
          strokeWidth={2}
          fill="none"
          opacity={0.85}
        />
        <Path
          d={`M 16 ${height * 0.7} Q ${width / 2} ${height * 0.05} ${width - 16} ${height * 0.7}`}
          stroke={colors.prayerHeroMuted}
          strokeWidth={6}
          fill="none"
          opacity={0.35}
        />
        {markers.map(mark => {
          const {x, y} = pointOnSunPath(mark, width, height);
          return (
            <Circle
              key={mark}
              cx={x}
              cy={y}
              r={4}
              fill={colors.prayerOnHero}
              opacity={0.7}
            />
          );
        })}
        <Circle cx={sun.x} cy={sun.y} r={8} fill={colors.prayerAccent} />
        <Circle
          cx={sun.x}
          cy={sun.y}
          r={14}
          fill={colors.prayerAccent}
          opacity={0.25}
        />
      </Svg>
    </View>
  );
};

export default PrayerSunPath;
