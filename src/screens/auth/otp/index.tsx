import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TextView from '@atoms/TextView';

const OTP = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'OTP'} />
    </View>
  );
};

export default OTP;
