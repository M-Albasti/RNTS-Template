//* packages import
import React, {Fragment, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

//* components import
import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {SoundProps} from '@Types/soundProps';

interface AudioContentProps {
  audioDetails: SoundProps;
}

const AudioContent = memo(({audioDetails}: AudioContentProps) => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      artworkWrap: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg,
      },
      artwork: {
        width: '78%',
        aspectRatio: 1,
        borderRadius: tokens.radius.xl,
        backgroundColor: tokens.colors.surfaceSecondary,
        ...tokens.shadows.md,
      },
      meta: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg,
        paddingTop: tokens.spacing.lg,
        gap: tokens.spacing.xs,
      },
    }),
  );

  return (
    <Fragment>
      <View style={styles.artworkWrap}>
        <Image
          source={{uri: audioDetails.artwork}}
          style={styles.artwork}
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
