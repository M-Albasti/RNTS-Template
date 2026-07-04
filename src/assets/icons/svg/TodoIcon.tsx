import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const TodoIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 12l3 3 5-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
};

export default TodoIcon;
