//* packages import
import React, {Fragment} from 'react';

//* components import
import TouchableText from '@atoms/TouchableText';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioSubmitStyles} from './styles/resolveAudioSubmitStyles';

interface AudioSubmitProps {
  retakeAudio: () => void;
  uploadAudio: () => Promise<void>;
  status: string;
}

const AudioSubmit = (props: AudioSubmitProps) => {
  const styles = useThemedStyles(resolveAudioSubmitStyles);

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
