import React from 'react';
import {View} from 'react-native';
import Svg, {Circle, Ellipse, Path, Rect} from 'react-native-svg';

import type {CameraFilterId} from '@constants/cameraFilters';

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
  if (filterId === 'none') {
    return null;
  }

  const centerX = width / 2;
  const faceTop = height * 0.18;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
      }}>
      <Svg width={width} height={height}>
        {filterId === 'dog' && (
          <>
            <Ellipse cx={centerX - 70} cy={faceTop + 10} rx={28} ry={40} fill="#8B5E3C" />
            <Ellipse cx={centerX + 70} cy={faceTop + 10} rx={28} ry={40} fill="#8B5E3C" />
            <Ellipse cx={centerX} cy={faceTop + 90} rx={18} ry={12} fill="#111" />
          </>
        )}
        {filterId === 'cat' && (
          <>
            <Path d={`M ${centerX - 90} ${faceTop + 40} L ${centerX - 50} ${faceTop - 10} L ${centerX - 30} ${faceTop + 30} Z`} fill="#F97316" />
            <Path d={`M ${centerX + 90} ${faceTop + 40} L ${centerX + 50} ${faceTop - 10} L ${centerX + 30} ${faceTop + 30} Z`} fill="#F97316" />
            <Circle cx={centerX - 35} cy={faceTop + 70} r={8} fill="#111" />
            <Circle cx={centerX + 35} cy={faceTop + 70} r={8} fill="#111" />
          </>
        )}
        {filterId === 'bunny' && (
          <>
            <Ellipse cx={centerX - 45} cy={faceTop - 20} rx={22} ry={55} fill="#F5F5F5" stroke="#DDD" strokeWidth={2} />
            <Ellipse cx={centerX + 45} cy={faceTop - 20} rx={22} ry={55} fill="#F5F5F5" stroke="#DDD" strokeWidth={2} />
            <Circle cx={centerX - 30} cy={faceTop + 80} r={6} fill="#F472B6" />
            <Circle cx={centerX + 30} cy={faceTop + 80} r={6} fill="#F472B6" />
          </>
        )}
        {filterId === 'crown' && (
          <Path
            d={`M ${centerX - 80} ${faceTop + 30} L ${centerX - 50} ${faceTop - 20} L ${centerX - 20} ${faceTop + 10} L ${centerX} ${faceTop - 30} L ${centerX + 20} ${faceTop + 10} L ${centerX + 50} ${faceTop - 20} L ${centerX + 80} ${faceTop + 30} Z`}
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth={2}
          />
        )}
        {filterId === 'hearts' && (
          <>
            <Path d={`M ${centerX - 50} ${faceTop + 60} C ${centerX - 70} ${faceTop + 30}, ${centerX - 20} ${faceTop + 30}, ${centerX - 50} ${faceTop + 90} Z`} fill="#FB7185" />
            <Path d={`M ${centerX + 50} ${faceTop + 60} C ${centerX + 70} ${faceTop + 30}, ${centerX + 20} ${faceTop + 30}, ${centerX + 50} ${faceTop + 90} Z`} fill="#FB7185" />
          </>
        )}
        {filterId === 'glasses' && (
          <>
            <Rect x={centerX - 95} y={faceTop + 55} width={70} height={40} rx={12} stroke="#111" strokeWidth={5} fill="rgba(0,0,0,0.15)" />
            <Rect x={centerX + 25} y={faceTop + 55} width={70} height={40} rx={12} stroke="#111" strokeWidth={5} fill="rgba(0,0,0,0.15)" />
            <Rect x={centerX - 25} y={faceTop + 70} width={50} height={6} fill="#111" />
          </>
        )}
      </Svg>
    </View>
  );
};

export default CameraFilterOverlay;
