//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import TouchableTextIcon from '@atoms/TouchableTextIcon';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveButtonsStyles} from './styles/resolveButtonsStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

interface AudiosListButtonsProps {
  navigateToRecordAudio: () => void;
}

const Buttons = (props: AudiosListButtonsProps): React.JSX.Element => {
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveButtonsStyles);

  return (
    <View style={styles.container}>
      <TouchableTextIcon
        iconType={'MaterialIcons'}
        name={'mic-external-on'}
        text={'Record Audio'}
        size={sizes.recordIcon}
        color={colors.textPrimary}
        onPress={props.navigateToRecordAudio}
        style={styles.recordText}
        touchableStyle={styles.recordTouchableContainer}
        containerStyle={styles.recordTextContainer}
      />
    </View>
  );
};

export default Buttons;
