//* packages import
import React, {Fragment, memo} from 'react';
import {Image, StyleSheet, View, ImageStyle} from 'react-native';

//* components import
import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioContentStyles} from './styles/resolveAudioContentStyles';

//* types import
import {SoundProps} from '@Types/soundProps';

interface AudioContentProps {
  audioDetails: SoundProps;
}

const AudioContent = memo(({audioDetails}: AudioContentProps) => {
  const styles = useThemedStyles(resolveAudioContentStyles)

  return (
    <Fragment>
      <View style={styles.artworkWrap}>
        <Image
          source={{uri: audioDetails.artwork}}
          style={styles.artwork as ImageStyle}
          resizeMode="cover"
        />
      </View>

      <View style={styles.meta}>
        <Heading text={audioDetails.title} level="h2" align="center" />
        <TextView
          text={audioDetails.artist}
          variant="body"
          muted
          align="center"
        />
        <TextView
          text={audioDetails.album}
          variant="caption"
          muted
          align="center"
        />
      </View>
    </Fragment>
  );
});

export default AudioContent;
