import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TextView from '@atoms/TextView';

const ForgetPassword = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Forget Password'} />
    </View>
  );
};

export default ForgetPassword;
