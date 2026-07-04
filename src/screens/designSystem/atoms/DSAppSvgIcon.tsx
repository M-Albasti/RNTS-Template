import React from 'react';
import {View} from 'react-native';

import AppSvgIcon from '@atoms/AppSvgIcon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDSAppSvgIconStyles} from './styles/resolveDSAppSvgIconStyles';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const NAMES = ['home', 'user', 'settings', 'chat'] as const;

const SvgIcons = (): React.JSX.Element => {
  const stackStyles = useShowcaseStack();
  const styles = useThemedStyles(resolveDSAppSvgIconStyles);
  return (
    <View style={stackStyles.row}>
      {NAMES.map(name => (
        <View key={name} style={styles.iconItem}>
          <AppSvgIcon name={name} size={32} />
          <TextView text={name} variant="caption" />
        </View>
      ))}
    </View>
  );
};

export default createShowcaseScreen({
  title: 'App SVG Icon',
  sections: [{title: 'Icon names', content: <SvgIcons />}],
});
