import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const GalleryIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="9" cy="10" r="2" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3 15l5-4 4 3 3-2 6 5" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
};

export default GalleryIcon;
