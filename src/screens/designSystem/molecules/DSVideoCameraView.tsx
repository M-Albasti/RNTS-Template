import React from 'react';

import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Video Camera View',
  subtitle: 'Requires a physical camera device — placeholder in design system.',
  sections: [
    {
      title: 'Placeholder',
      content: (
        <TextView
          text="CameraView needs react-native-vision-camera device props. Use Record Video template on a real device."
          variant="bodySmall"
          muted
        />
      ),
    },
  ],
});
