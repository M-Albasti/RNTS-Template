import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const VideoIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="14" height="12" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M17 10l4-2v8l-4-2" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
};

export default VideoIcon;
