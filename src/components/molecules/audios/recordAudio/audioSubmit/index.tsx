//* packages import
import React, {Fragment} from 'react';
import {StyleSheet} from 'react-native';

//* components import
import TouchableText from '@atoms/TouchableText';

interface AudioSubmitProps {
  retakeAudio: () => void;
  uploadAudio: () => Promise<void>;
  status: string;
}

const AudioSubmit = (props: AudioSubmitProps) => {
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

const styles = StyleSheet.create({
  buttonContainerStyle: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
});
