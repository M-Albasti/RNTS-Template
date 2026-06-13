import React from 'react';
import Svg, {Line} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const MenuIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="4" y1="17" x2="20" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
};

export default MenuIcon;
