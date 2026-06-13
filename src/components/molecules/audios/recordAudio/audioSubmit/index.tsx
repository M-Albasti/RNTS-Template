//* packages import
import React, {Fragment} from 'react';

//* components import
import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';

interface AudioSubmitProps {
  retakeAudio: () => void;
  uploadAudio: () => Promise<void>;
  status: string;
}

const AudioSubmit = (props: AudioSubmitProps) => {
  const styles = useThemedStyles(t => ({
    buttonContainerStyle: {
      padding: t.spacing.md,
      margin: t.spacing.md,
      borderWidth: t.layout.borderWidth.sm,
      borderRadius: t.radius.lg,
      ...t.layout.presets.center,
      width: t.sizes.videoPreview,
    },
  }));

  return (
    <Fragment>
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={'Retake Audio'}
        onPress={props.retakeAudio}
      />
      <TouchableText
        textStyle={{}}
        touchableStyle={styles.buttonContainerStyle}
        text={props.status == 'loading' ? 'Upload in progress' : 'Upload Audio'}
        onPress={props.uploadAudio}
        disabled={props.status == 'loading'}
      />
    </Fragment>
  );
};

export default AudioSubmit;
