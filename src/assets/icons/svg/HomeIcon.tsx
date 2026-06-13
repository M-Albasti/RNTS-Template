import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const HomeIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HomeIcon;
