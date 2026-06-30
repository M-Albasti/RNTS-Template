import React from 'react';
import {View} from 'react-native';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveShowcaseSectionStyles} from './styles/resolveShowcaseSectionStyles';

type ShowcaseSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const ShowcaseSection = ({
  title,
  description,
  children,
}: ShowcaseSectionProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveShowcaseSectionStyles);

  return (
    <View>
      <Heading text={title} level="h3" />
      {description ? (
        <>
          <Spacer size="xs" />
          <TextView text={description} variant="bodySmall" muted />
        </>
      ) : null}
      <Spacer size="sm" />
      <Card elevated={false}>
        <View style={styles.content}>{children}</View>
      </Card>
      <Spacer size="lg" />
    </View>
  );
};

export default ShowcaseSection;
