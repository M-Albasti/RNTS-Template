import React from 'react';

import Card from '@atoms/Card';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Card',
  sections: [
    {
      title: 'Elevated (default)',
      content: (
        <Card>
          <TextView text="Elevated card with padding" />
        </Card>
      ),
    },
    {
      title: 'Flat outline',
      content: (
        <Card elevated={false}>
          <TextView text="Non-elevated card" />
        </Card>
      ),
    },
    {
      title: 'Unpadded',
      content: (
        <Card padded={false}>
          <TextView text="No inner padding" />
        </Card>
      ),
    },
    {
      title: 'Constrained width',
      content: (
        <Card constrained>
          <TextView text="Max width 360px" />
        </Card>
      ),
    },
  ],
});
