import React, {useState} from 'react';

import Button from '@atoms/Button';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const RecordVideoContent = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TextView
        text="Record video template wraps VideoCameraModal. Camera requires a physical device."
        variant="bodySmall"
        muted
      />
      <Button
        label={open ? 'Camera would be open' : 'Simulate open camera'}
        onPress={() => setOpen(prev => !prev)}
      />
      {open ? (
        <TextView text="On device, VideoCameraModal renders full-screen here." variant="caption" />
      ) : null}
    </>
  );
};

export default createShowcaseScreen({
  title: 'Record Video Template',
  sections: [{title: 'Camera placeholder', content: <RecordVideoContent />}],
});
