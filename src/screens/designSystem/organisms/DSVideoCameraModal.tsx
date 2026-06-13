import React, {useState} from 'react';

import Button from '@atoms/Button';
import TextView from '@atoms/TextView';
import VideoCameraModal from '@organisms/videos/recordVideo/VideoCameraModal';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {recordVideoShowcaseNavigation} from '../shared/showcaseHelpers';

const CameraModalDemo = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <>
        <VideoCameraModal navigation={recordVideoShowcaseNavigation} />
        <Button label="Close preview" onPress={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <TextView
        text="Camera modal opens full-screen with device permissions. Tap below to preview closed state note."
        variant="bodySmall"
        muted
      />
      <Button label="Open camera modal" onPress={() => setOpen(true)} />
    </>
  );
};

export default createShowcaseScreen({
  title: 'Video Camera Modal',
  subtitle: 'Requires camera on a physical device.',
  sections: [{title: 'Closed + open', content: <CameraModalDemo />}],
});
