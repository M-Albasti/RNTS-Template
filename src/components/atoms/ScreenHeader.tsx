import React from 'react';
import {StyleSheet, View} from 'react-native';

import Heading from '@atoms/Heading';
import TouchableIcon from '@atoms/TouchableIcon';

import {useThemedStyles} from '@theme/createThemedStyles';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

const ScreenHeader = ({
  title,
  onBack,
  showBack = true,
}: ScreenHeaderProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.md,
        minHeight: 44,
      },
      side: {
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
      },
      titleWrap: {
        flex: 1,
        alignItems: 'center',
      },
    }),
  );

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack && onBack ? (
          <TouchableIcon
            iconType="Ionicons"
            name="chevron-back"
            size={26}
            onPress={onBack}
          />
        ) : null}
      </View>
      <View style={styles.titleWrap}>
        <Heading text={title} level="h3" align="center" />
      </View>
      <View style={styles.side} />
    </View>
  );
};

export default ScreenHeader;
