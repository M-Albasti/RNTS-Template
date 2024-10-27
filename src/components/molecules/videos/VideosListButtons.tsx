import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TouchableTextIcon from '../TouchableTextIcon';
import {appColors} from '@constants/colors';

interface VideosListButtonsProps {
  navigateToRecordVideo: () => void;
}

const VideosListButtons = (props: VideosListButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableTextIcon
        iconType={'FontAwesome5'}
        name={'camera-retro'}
        text={'Record Video'}
        size={35}
        color={appColors.black}
        onPress={props.navigateToRecordVideo}
        style={styles.recordText}
        touchableStyle={styles.recordTouchableContainer}
        containerStyle={styles.recordTextContainer}
      />
    </View>
  );
};

export default VideosListButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordTouchableContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 10,
  },
  recordTextContainer: {
    paddingHorizontal: 5,
  },
  recordText: {
    textAlign: 'right',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
