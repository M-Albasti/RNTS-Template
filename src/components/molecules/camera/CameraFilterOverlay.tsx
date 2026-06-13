import React from 'react';
import {View} from 'react-native';
import Svg, {Circle, Ellipse, Path, Rect} from 'react-native-svg';

import type {CameraFilterId} from '@constants/cameraFilters';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

type CameraFilterOverlayProps = {
  filterId: CameraFilterId;
  width: number;
  height: number;
};

/**
 * Visual face-style overlays for Snap camera mode.
 * These are positioned for a typical front-camera selfie (not ML face tracking).
 */
const CameraFilterOverlay = ({
  filterId,
  width,
  height,
}: CameraFilterOverlayProps): React.JSX.Element | null => {
  const {palette} = useThemeTokens();
  const styles = useThemedStyles(t => ({
    overlay: {
      ...t.layout.presets.absoluteFill,
    },
  }));

  if (filterId === 'none') {
    return null;
  }

  const centerX = width / 2;
  const faceTop = height * 0.18;

  return (
    <View pointerEvents="none" style={[styles.overlay, {width, height}]}>
      <Svg width={width} height={height}>
        {filterId === 'dog' && (
          <>
            <Ellipse cx={centerX - 70} cy={faceTop + 10} rx={28} ry={40} fill={palette.chocolate} />
            <Ellipse cx={centerX + 70} cy={faceTop + 10} rx={28} ry={40} fill={palette.chocolate} />
            <Ellipse cx={centerX} cy={faceTop + 90} rx={18} ry={12} fill={palette.black} />
          </>
        )}
        {filterId === 'cat' && (
          <>
            <Path d={`M ${centerX - 90} ${faceTop + 40} L ${centerX - 50} ${faceTop - 10} L ${centerX - 30} ${faceTop + 30} Z`} fill={palette.orange} />
            <Path d={`M ${centerX + 90} ${faceTop + 40} L ${centerX + 50} ${faceTop - 10} L ${centerX + 30} ${faceTop + 30} Z`} fill={palette.orange} />
            <Circle cx={centerX - 35} cy={faceTop + 70} r={8} fill={palette.black} />
            <Circle cx={centerX + 35} cy={faceTop + 70} r={8} fill={palette.black} />
          </>
        )}
        {filterId === 'bunny' && (
          <>
            <Ellipse cx={centerX - 45} cy={faceTop - 20} rx={22} ry={55} fill={palette.softWhite} stroke={palette.softGray} strokeWidth={2} />
            <Ellipse cx={centerX + 45} cy={faceTop - 20} rx={22} ry={55} fill={palette.softWhite} stroke={palette.softGray} strokeWidth={2} />
            <Circle cx={centerX - 30} cy={faceTop + 80} r={6} fill={palette.hotPink} />
            <Circle cx={centerX + 30} cy={faceTop + 80} r={6} fill={palette.hotPink} />
          </>
        )}
        {filterId === 'crown' && (
          <Path
            d={`M ${centerX - 80} ${faceTop + 30} L ${centerX - 50} ${faceTop - 20} L ${centerX - 20} ${faceTop + 10} L ${centerX} ${faceTop - 30} L ${centerX + 20} ${faceTop + 10} L ${centerX + 50} ${faceTop - 20} L ${centerX + 80} ${faceTop + 30} Z`}
            fill={palette.gold}
            stroke={palette.brown}
            strokeWidth={2}
          />
        )}
        {filterId === 'hearts' && (
          <>
            <Path d={`M ${centerX - 50} ${faceTop + 60} C ${centerX - 70} ${faceTop + 30}, ${centerX - 20} ${faceTop + 30}, ${centerX - 50} ${faceTop + 90} Z`} fill={palette.salmon} />
            <Path d={`M ${centerX + 50} ${faceTop + 60} C ${centerX + 70} ${faceTop + 30}, ${centerX + 20} ${faceTop + 30}, ${centerX + 50} ${faceTop + 90} Z`} fill={palette.salmon} />
          </>
        )}
        {filterId === 'glasses' && (
          <>
            <Rect x={centerX - 95} y={faceTop + 55} width={70} height={40} rx={12} stroke={palette.black} strokeWidth={5} fill={palette.black15} />
            <Rect x={centerX + 25} y={faceTop + 55} width={70} height={40} rx={12} stroke={palette.black} strokeWidth={5} fill={palette.black15} />
            <Rect x={centerX - 25} y={faceTop + 70} width={50} height={6} fill={palette.black} />
          </>
        )}
      </Svg>
    </View>
  );
};

export default CameraFilterOverlay;
