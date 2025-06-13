//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import TextView from '@atoms/TextView';

//* constants import
import {appColors} from '@constants/colors';

interface OTPTextProps {}

const OTPText = (props: OTPTextProps): React.JSX.Element => {
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

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: appColors.gray,
    marginBottom: 30,
    textAlign: 'center',
  },
});
