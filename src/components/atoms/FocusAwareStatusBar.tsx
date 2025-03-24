import React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {appColors} from '@constants/colors';

//* types import
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
  showHideTransition = 'fade', // fade, slide and none
  animated = true,
  backgroundColor = appColors.primary,
  barStyle = 'default', // default, dark-content and light-content
  hidden = false,
  translucent = false,
  networkActivityIndicatorVisible = true,
}: StatusBarProps): React.JSX.Element | null => {
  const isFocused = useIsFocused();

  return isFocused ? (
    <StatusBar
      showHideTransition={showHideTransition}
      animated={animated}
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      hidden={hidden}
      translucent={translucent}
      networkActivityIndicatorVisible={networkActivityIndicatorVisible}
    />
  ) : null;
};

export default FocusAwareStatusBar;
