import React from 'react';
import {View} from 'react-native';

import Divider from '@atoms/Divider';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const DIVIDER_SPACING = ['none', 'sm', 'md', 'lg'] as const;
const SPACER_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const DividerSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      {DIVIDER_SPACING.map(spacing => (
        <View key={spacing}>
          <TextView text={`spacing="${spacing}"`} variant="caption" muted />
          <Divider spacing={spacing} />
        </View>
      ))}
    </View>
  );
};

const SpacerSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      {SPACER_SIZES.map(size => (
        <View key={size}>
          <TextView text={`Spacer size="${size}"`} variant="caption" />
          <View style={{backgroundColor: '#38BDF8', height: 2}} />
          <Spacer size={size} />
          <View style={{backgroundColor: '#38BDF8', height: 2}} />
        </View>
      ))}
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Layout Primitives',
  subtitle: 'Divider and Spacer spacing scale.',
  sections: [
    {title: 'Divider spacing', content: <DividerSection />},
    {title: 'Spacer sizes', content: <SpacerSection />},
  ],
});
