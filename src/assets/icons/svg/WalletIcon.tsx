import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const WalletIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3 10h18" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="16" cy="14" r="1.5" fill={color} />
    </Svg>
  );
};

export default WalletIcon;
