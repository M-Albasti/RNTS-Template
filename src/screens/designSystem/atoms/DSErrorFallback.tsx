import React from 'react';
import {View} from 'react-native';

import ErrorFallback from '@atoms/ErrorFallback';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {sizes} from '@theme/tokens/sizes';

const MockError = new Error('Design system mock error');

const FallbackPreview = (): React.JSX.Element => (
  <View style={{minHeight: sizes.showcaseErrorMin}}>
    <ErrorFallback error={MockError} resetErrorBoundary={() => {}} />
  </View>
);

export default createShowcaseScreen({
  title: 'Error Fallback',
  subtitle: 'Error boundary fallback UI with mock reset handler.',
  sections: [{title: 'Preview', content: <FallbackPreview />}],
});
