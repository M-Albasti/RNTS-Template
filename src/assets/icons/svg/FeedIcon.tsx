import React from 'react';
import Svg, {Rect} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const FeedIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="5" rx="1" stroke={color} strokeWidth={strokeWidth} />
      <Rect x="4" y="11" width="16" height="5" rx="1" stroke={color} strokeWidth={strokeWidth} />
      <Rect x="4" y="18" width="10" height="2" rx="1" fill={color} />
    </Svg>
  );
};

export default FeedIcon;
