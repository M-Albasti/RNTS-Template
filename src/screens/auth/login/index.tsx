import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TouchableText from '@atoms/TouchableText';
import TextView from '@atoms/TextView';

const Login = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Login'} style={styles.textStyle} />
      <TouchableText
        textStyle={styles.textStyle}
        text={'Go Home'}
        onPress={() => {
          props.navigation.replace('DrawerRoot');
        }}
      />
    </View>
  );
};

export default Login;
