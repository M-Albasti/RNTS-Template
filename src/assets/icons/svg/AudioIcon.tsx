import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

import {resolveSvgIconProps} from './resolveSvgIconProps';
import type {SvgIconProps} from './types';

const AudioIcon = (props: SvgIconProps): React.JSX.Element => {
  const {size, color, strokeWidth} = resolveSvgIconProps(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V6l10-2v14" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Circle cx="7" cy="18" r="3" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="17" cy="16" r="3" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
};

export default AudioIcon;
