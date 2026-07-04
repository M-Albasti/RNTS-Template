//* package imports
import React from 'react';
import {View} from 'react-native';

//* components imports
import TouchableTextIcon from '@atoms/TouchableTextIcon';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveButtonsStyles} from './styles/resolveButtonsStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

interface VideosListButtonsProps {
  navigateToRecordVideo: () => void;
}

const Buttons = (props: VideosListButtonsProps): React.JSX.Element => {
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveButtonsStyles);

  return (
    <View style={styles.container}>
      <TouchableTextIcon
        iconType={'FontAwesome5'}
        name={'camera-retro'}
        text={'Record Video'}
        size={sizes.recordIcon}
        color={colors.textPrimary}
        onPress={props.navigateToRecordVideo}
        style={styles.recordText}
        touchableStyle={styles.recordTouchableContainer}
        containerStyle={styles.recordTextContainer}
      />
    </View>
  );
};

export default Buttons;
