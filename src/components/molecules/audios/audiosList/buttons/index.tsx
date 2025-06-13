//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TouchableTextIcon from '@atoms/TouchableTextIcon';

//* constants import
import {appColors} from '@constants/colors';

interface AudiosListButtonsProps {
  navigateToRecordAudio: () => void;
}

const Buttons = (props: AudiosListButtonsProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TouchableTextIcon
        iconType={'MaterialIcons'}
        name={'mic-external-on'}
        text={'Record Audio'}
        size={35}
        color={appColors.black}
        onPress={props.navigateToRecordAudio}
        style={styles.recordText}
        touchableStyle={styles.recordTouchableContainer}
        containerStyle={styles.recordTextContainer}
      />
    </View>
  );
};

export default Buttons;

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
