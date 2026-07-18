import React, {useMemo} from 'react';
import {View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type Props = {
  /** 0–1 progress through the day (local time). */
  dayProgress: number;
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
  const sunX = 24 + progress * (width - 48);
  const sunY = height * 0.55 - Math.sin(progress * Math.PI) * (height * 0.35);

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
          const x = 16 + mark * (width - 32);
          const y = height * 0.7 - Math.sin(mark * Math.PI) * (height * 0.55);
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
        <Circle cx={sunX} cy={sunY} r={8} fill={colors.prayerAccent} />
        <Circle
          cx={sunX}
          cy={sunY}
          r={14}
          fill={colors.prayerAccent}
          opacity={0.25}
        />
      </Svg>
    </View>
  );
};

export default PrayerSunPath;
