import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';
import {useThemedStyles} from '@theme/createThemedStyles';

const OTPText = (): React.JSX.Element => {
  const styles = useThemedStyles(t => ({
    title: {
      ...t.typography.h2,
      marginBottom: t.spacing.md,
      textAlign: t.layout.textAlign.center,
      color: t.colors.textPrimary,
    },
    subtitle: {
      ...t.typography.body,
      color: t.colors.textMuted,
      marginBottom: t.spacing.xxl,
      textAlign: t.layout.textAlign.center,
    },
  }));

  return (
    <View>
      <TextView text={'Enter Verification Code'} style={styles.title} />
      <TextView
        text={'We have sent you a 6 digit verification code'}
        style={styles.subtitle}
      />
    </View>
  );
};

export default OTPText;
