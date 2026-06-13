import React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {useThemeTokens} from '@theme/useThemeTokens';

import type {StatusBarStyle} from 'react-native';

interface StatusBarProps {
  showHideTransition?: 'fade' | 'slide' | 'none';
  animated?: boolean;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  hidden?: boolean;
  translucent?: boolean;
  networkActivityIndicatorVisible?: boolean;
}

const FocusAwareStatusBar = ({
  showHideTransition = 'fade',
  animated = true,
  backgroundColor,
  barStyle = 'default',
  hidden = false,
  translucent = false,
  networkActivityIndicatorVisible = true,
}: StatusBarProps): React.JSX.Element | null => {
  const {colors} = useThemeTokens();
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      showHideTransition={showHideTransition}
      animated={animated}
      backgroundColor={backgroundColor ?? colors.primary}
      barStyle={barStyle}
      hidden={hidden}
      translucent={translucent}
      networkActivityIndicatorVisible={networkActivityIndicatorVisible}
    />
  );
};

export default FocusAwareStatusBar;
