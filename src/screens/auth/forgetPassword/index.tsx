//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import TextView from '@atoms/TextView';

//* styles import
import {styles} from './styles';

const ForgetPassword = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Forget Password'} />
    </View>
  );
};

export default ForgetPassword;
