import React from 'react';
import {View, ViewStyle} from 'react-native';

import {
  AppSvgIcons,
  type AppSvgIconName,
  type SvgIconProps,
} from '@assets/icons/svg';

type AppSvgIconProps = SvgIconProps & {
  name: AppSvgIconName;
  containerStyle?: ViewStyle;
};

/** Themed SVG icon wrapper — use alongside vector-icons where SVG is preferred. */
const AppSvgIcon = ({
  name,
  containerStyle,
  ...iconProps
}: AppSvgIconProps): React.JSX.Element => {
  const Icon = AppSvgIcons[name];

  return (
    <View style={containerStyle}>
      <Icon {...iconProps} />
    </View>
  );
};

export default AppSvgIcon;
