//* packages import
import React, {Fragment, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ScreenHeight} from '@rneui/base';

//* components import
import TextView from '@atoms/TextView';

//* constants import
import {appColors} from '@constants/colors';

//* types import
import {SoundProps} from '@Types/soundProps';

interface AudioContentProps {
  audioDetails: SoundProps;
}

const AudioContent = memo((props: AudioContentProps) => {
  return (
    <Fragment>
      <View style={styles.musicLogoView}>
        <Image
          source={{uri: props.audioDetails.artwork}}
          style={styles.imageView}
          resizeMode="stretch"
        />
      </View>

      <View style={styles.nameOfSongView}>
        <TextView
          text={props.audioDetails.artist}
          style={styles.nameOfSongText1}
        />
        <TextView
          text={props.audioDetails.album}
          style={styles.nameOfSongText2}
        />
      </View>
    </Fragment>
  );
});

export default AudioContent;

const styles = StyleSheet.create({
  musicLogoView: {
    height: ScreenHeight * 0.3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: '100%',
    width: '80%',
    borderRadius: 10,
  },
  nameOfSongView: {
    height: ScreenHeight * 0.15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameOfSongText1: {
    fontSize: 19,
    fontWeight: 'bold',
    color: appColors.black80,
  },
  nameOfSongText2: {
    color: appColors.black60,
    marginTop: '4%',
  },
});
