import React from 'react';
import {View} from 'react-native';

import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const TEXT_VARIANTS = ['body', 'bodySmall', 'caption', 'h3'] as const;
const HEADING_LEVELS = ['display', 'h1', 'h2', 'h3'] as const;
const HEADING_TONES = ['default', 'muted', 'primary'] as const;

const TextViewSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      {TEXT_VARIANTS.map(variant => (
        <TextView key={variant} text={`TextView ${variant}`} variant={variant} />
      ))}
      <TextView text="Muted body" variant="body" muted />
      <TextView text="Center aligned" variant="body" align="center" />
    </View>
  );
};

const HeadingSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      {HEADING_LEVELS.map(level => (
        <Heading key={level} text={`Heading ${level}`} level={level} />
      ))}
      {HEADING_TONES.map(tone => (
        <Heading key={tone} text={`Tone ${tone}`} level="h3" tone={tone} />
      ))}
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Typography',
  subtitle: 'TextView and Heading tokens.',
  sections: [
    {title: 'TextView', content: <TextViewSection />},
    {title: 'Heading', content: <HeadingSection />},
  ],
});
