import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const ChatIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4v-4H6a2 2 0 01-2-2V5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChatIcon;
