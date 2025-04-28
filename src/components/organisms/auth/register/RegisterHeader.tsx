//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';

//* components import
import TextView from '@atoms/TextView';

const RegisterHeader = (props: any): React.JSX.Element => {
  return <TextView text={'Register Header'} containerStyle={styles.container} />;
};

export default RegisterHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
