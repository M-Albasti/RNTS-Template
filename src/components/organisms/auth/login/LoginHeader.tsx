//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';

//* components import
import TextView from '@atoms/TextView';

const LoginHeader = (props: any): React.JSX.Element => {
  return <TextView text={'Login Header'} containerStyle={styles.container} />;
};

export default LoginHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
