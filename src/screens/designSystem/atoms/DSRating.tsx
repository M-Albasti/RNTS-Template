import React, {useState} from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Rating from '@atoms/Rating';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const AVERAGE_SAMPLES = [
  {label: 'Listing average', value: 4.2, reviewCount: 128},
  {label: 'Merchant store', value: 4.8, reviewCount: 124},
  {label: 'Low average', value: 2.1, reviewCount: 9},
  {label: 'High precision', value: 4.93, reviewCount: 512},
] as const;

const AverageRatingsSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();

  return (
    <View style={styles.stack}>
      {AVERAGE_SAMPLES.map(sample => (
        <View key={sample.label} style={styles.stack}>
          <TextView text={sample.label} variant="caption" muted />
          <Rating
            value={sample.value}
            showValue
            reviewCount={sample.reviewCount}
            precision={sample.label === 'High precision' ? 2 : 1}
            sizeToken="lg"
          />
        </View>
      ))}
    </View>
  );
};

const SizesSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  const sizes = ['sm', 'md', 'lg', 'xl'] as const;

  return (
    <View style={styles.stack}>
      {sizes.map(sizeToken => (
        <View key={sizeToken} style={styles.stack}>
          <TextView text={`sizeToken="${sizeToken}"`} variant="caption" muted />
          <Rating value={4.2} showValue sizeToken={sizeToken} />
        </View>
      ))}
    </View>
  );
};

const InteractiveSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  const [value, setValue] = useState(3.5);

  return (
    <View style={styles.stack}>
      <TextView
        text="Tap left half of a star for .5 — right half for full star."
        variant="caption"
        muted
      />
      <Rating value={value} interactive allowHalf onChange={setValue} sizeToken="xl" showValue />
      <Rating value={value} interactive allowHalf={false} onChange={setValue} sizeToken="lg" />
    </View>
  );
};

const AnimationSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  const [value, setValue] = useState(2.1);

  return (
    <View style={styles.stack}>
      <Rating value={value} showValue animated sizeToken="lg" />
      <View style={styles.row}>
        <Button label="Set 4.2" variant="outline" onPress={() => setValue(4.2)} />
        <Button label="Set 2.1" variant="outline" onPress={() => setValue(2.1)} />
        <Button label="Set 4.9" variant="outline" onPress={() => setValue(4.9)} />
      </View>
      <TextView text="Static (no animation)" variant="caption" muted />
      <Rating value={4.2} animated={false} showValue sizeToken="lg" />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Rating',
  subtitle:
    'Animated fractional stars from @atoms/Rating — uses tokens.colors.ratingStar, layout.presets.clipOverlayTopLeft, and tokens.rating.',
  sections: [
    {
      title: 'Average ratings',
      description: 'Partial star fill for decimals like 4.2 or 2.1.',
      content: <AverageRatingsSection />,
    },
    {
      title: 'Sizes',
      description: 'sizeToken maps to tokens.rating.size (sm · md · lg · xl).',
      content: <SizesSection />,
    },
    {
      title: 'Interactive',
      description: 'Half-star selection with spring press feedback.',
      content: <InteractiveSection />,
    },
    {
      title: 'Animation',
      description: 'Staggered spring fill on value change; toggle animated={false} to disable.',
      content: <AnimationSection />,
    },
  ],
});
