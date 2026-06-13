import React from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const VariantsSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      {VARIANTS.map(variant => (
        <Button key={variant} label={variant} variant={variant} onPress={() => {}} />
      ))}
    </View>
  );
};

const SizesSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      {SIZES.map(size => (
        <Button key={size} label={`Size ${size}`} size={size} onPress={() => {}} />
      ))}
    </View>
  );
};

const StatesSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <Button label="Loading" loading onPress={() => {}} />
      <Button label="Disabled" disabled onPress={() => {}} />
      <Button label="Full width" fullWidth onPress={() => {}} />
      <Button label="Flat primary" flat onPress={() => {}} />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Button',
  subtitle: 'Primary actions and variants from @atoms/Button.',
  sections: [
    {title: 'Variants', content: <VariantsSection />},
    {title: 'Sizes', content: <SizesSection />},
    {title: 'States', content: <StatesSection />},
  ],
});
