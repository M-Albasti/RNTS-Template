import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const BackIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6l-6 6 6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BackIcon;
