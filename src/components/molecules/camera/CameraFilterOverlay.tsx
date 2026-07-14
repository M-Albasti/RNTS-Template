import React from 'react';
import {View} from 'react-native';
import Svg, {Circle, Ellipse, Path, Rect} from 'react-native-svg';

import type {CameraFilterId} from '@constants/cameraFilters';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveCameraFilterOverlayStyles} from './styles/resolveCameraFilterOverlayStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type CameraFilterOverlayProps = {
  filterId: CameraFilterId;
  width: number;
  height: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Visual face-style overlays for Snap camera mode.
 * Positioned for a typical front-camera selfie (not ML face tracking).
 * Preview-only — overlays are not baked into the saved photo.
 * Geometry scales with layout size so features stay proportional across phones/tablets.
 */
const CameraFilterOverlay = ({
  filterId,
  width,
  height,
}: CameraFilterOverlayProps): React.JSX.Element | null => {
  const {palette} = useThemeTokens();
  const styles = useThemedStyles(resolveCameraFilterOverlayStyles);

  if (filterId === 'none' || width <= 0 || height <= 0) {
    return null;
  }

  const unit = clamp(Math.min(width, height) * 0.04, 8, 18);
  const centerX = width / 2;
  const faceTop = height * 0.18;

  return (
    <View pointerEvents="none" style={[styles.overlay, {width, height}]}>
      <Svg width={width} height={height}>
        {filterId === 'dog' && (
          <>
            <Ellipse
              cx={centerX - unit * 3.9}
              cy={faceTop + unit * 0.55}
              rx={unit * 1.55}
              ry={unit * 2.2}
              fill={palette.chocolate}
            />
            <Ellipse
              cx={centerX + unit * 3.9}
              cy={faceTop + unit * 0.55}
              rx={unit * 1.55}
              ry={unit * 2.2}
              fill={palette.chocolate}
            />
            <Ellipse
              cx={centerX}
              cy={faceTop + unit * 5}
              rx={unit}
              ry={unit * 0.65}
              fill={palette.black}
            />
          </>
        )}
        {filterId === 'cat' && (
          <>
            <Path
              d={`M ${centerX - unit * 5} ${faceTop + unit * 2.2} L ${centerX - unit * 2.8} ${faceTop - unit * 0.55} L ${centerX - unit * 1.65} ${faceTop + unit * 1.65} Z`}
              fill={palette.orange}
            />
            <Path
              d={`M ${centerX + unit * 5} ${faceTop + unit * 2.2} L ${centerX + unit * 2.8} ${faceTop - unit * 0.55} L ${centerX + unit * 1.65} ${faceTop + unit * 1.65} Z`}
              fill={palette.orange}
            />
            <Circle cx={centerX - unit * 1.95} cy={faceTop + unit * 3.9} r={unit * 0.45} fill={palette.black} />
            <Circle cx={centerX + unit * 1.95} cy={faceTop + unit * 3.9} r={unit * 0.45} fill={palette.black} />
          </>
        )}
        {filterId === 'bunny' && (
          <>
            <Ellipse
              cx={centerX - unit * 2.5}
              cy={faceTop - unit * 1.1}
              rx={unit * 1.2}
              ry={unit * 3}
              fill={palette.softWhite}
              stroke={palette.softGray}
              strokeWidth={unit * 0.1}
            />
            <Ellipse
              cx={centerX + unit * 2.5}
              cy={faceTop - unit * 1.1}
              rx={unit * 1.2}
              ry={unit * 3}
              fill={palette.softWhite}
              stroke={palette.softGray}
              strokeWidth={unit * 0.1}
            />
            <Circle cx={centerX - unit * 1.65} cy={faceTop + unit * 4.4} r={unit * 0.35} fill={palette.hotPink} />
            <Circle cx={centerX + unit * 1.65} cy={faceTop + unit * 4.4} r={unit * 0.35} fill={palette.hotPink} />
          </>
        )}
        {filterId === 'crown' && (
          <Path
            d={`M ${centerX - unit * 4.4} ${faceTop + unit * 1.65} L ${centerX - unit * 2.8} ${faceTop - unit * 1.1} L ${centerX - unit * 1.1} ${faceTop + unit * 0.55} L ${centerX} ${faceTop - unit * 1.65} L ${centerX + unit * 1.1} ${faceTop + unit * 0.55} L ${centerX + unit * 2.8} ${faceTop - unit * 1.1} L ${centerX + unit * 4.4} ${faceTop + unit * 1.65} Z`}
            fill={palette.gold}
            stroke={palette.brown}
            strokeWidth={unit * 0.1}
          />
        )}
        {filterId === 'hearts' && (
          <>
            <Path
              d={`M ${centerX - unit * 2.8} ${faceTop + unit * 3.3} C ${centerX - unit * 3.9} ${faceTop + unit * 1.65}, ${centerX - unit * 1.1} ${faceTop + unit * 1.65}, ${centerX - unit * 2.8} ${faceTop + unit * 5} Z`}
              fill={palette.salmon}
            />
            <Path
              d={`M ${centerX + unit * 2.8} ${faceTop + unit * 3.3} C ${centerX + unit * 3.9} ${faceTop + unit * 1.65}, ${centerX + unit * 1.1} ${faceTop + unit * 1.65}, ${centerX + unit * 2.8} ${faceTop + unit * 5} Z`}
              fill={palette.salmon}
            />
          </>
        )}
        {filterId === 'glasses' && (
          <>
            <Rect
              x={centerX - unit * 5.3}
              y={faceTop + unit * 3}
              width={unit * 3.9}
              height={unit * 2.2}
              rx={unit * 0.65}
              stroke={palette.black}
              strokeWidth={unit * 0.28}
              fill={palette.black15}
            />
            <Rect
              x={centerX + unit * 1.4}
              y={faceTop + unit * 3}
              width={unit * 3.9}
              height={unit * 2.2}
              rx={unit * 0.65}
              stroke={palette.black}
              strokeWidth={unit * 0.28}
              fill={palette.black15}
            />
            <Rect
              x={centerX - unit * 1.4}
              y={faceTop + unit * 3.9}
              width={unit * 2.8}
              height={unit * 0.35}
              fill={palette.black}
            />
          </>
        )}
      </Svg>
    </View>
  );
};

export default CameraFilterOverlay;
