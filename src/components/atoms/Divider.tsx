import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDividerStyles} from './styles/resolveDividerStyles';

interface DividerProps {
  style?: ViewStyle;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const Divider = ({style, spacing = 'md'}: DividerProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveDividerStyles);

  const spacingStyle = styles[spacing];

  return <View style={[styles.line, spacingStyle, style]} />;
};

export default Divider;
