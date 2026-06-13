import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const GameIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="10" rx="3" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 13h4M10 11v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="16" cy="12" r="1" fill={color} />
      <Circle cx="18" cy="14" r="1" fill={color} />
    </Svg>
  );
};

export default GameIcon;
