import React from 'react';
import {View} from 'react-native';

import ErrorFallback from '@atoms/ErrorFallback';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const MockError = new Error('Design system mock error');

const FallbackPreview = (): React.JSX.Element => (
  <View style={{minHeight: 320}}>
    <ErrorFallback error={MockError} resetErrorBoundary={() => {}} />
  </View>
);

export default createShowcaseScreen({
  title: 'Error Fallback',
  subtitle: 'Error boundary fallback UI with mock reset handler.',
  sections: [{title: 'Preview', content: <FallbackPreview />}],
});
