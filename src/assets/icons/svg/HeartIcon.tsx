import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const HeartIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20s-7-4.5-9-8.5C1.5 8.5 4 5 7.5 5c2 0 3.2 1.2 4.5 2.7C13.3 6.2 14.5 5 16.5 5 20 5 22.5 8.5 21 11.5 19 15.5 12 20 12 20z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HeartIcon;
