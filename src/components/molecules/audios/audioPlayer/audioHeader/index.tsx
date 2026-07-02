import React, {memo} from 'react';
import {View} from 'react-native';
import {ScreenHeight} from '@rneui/base';

import TouchableIcon from '@atoms/TouchableIcon';
import TextView from '@atoms/TextView';
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAudioHeaderStyles} from './styles/resolveAudioHeaderStyles';

import type {AppStackNavigationProp} from '@Types/appNavigation';

interface AudioHeaderProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
}

const AudioHeader = memo((props: AudioHeaderProps): React.JSX.Element => {
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveAudioHeaderStyles);

  return (
    <View style={styles.mainbar}>
      <TouchableIcon
        iconType={'AntDesign'}
        name={'left'}
        size={sizes.iconSm}
        color={colors.textPrimary}
        onPress={() => {
          if (props.navigation.canGoBack()) {
            props.navigation.goBack();
          }
        }}
      />
      <TextView text={'Now Playing'} style={styles.nowPlayingText} />
      <TouchableIcon
        iconType={'Entypo'}
        name="dots-three-horizontal"
        size={sizes.iconSm}
        color={colors.textPrimary}
      />
    </View>
  );
});

export default AudioHeader;
