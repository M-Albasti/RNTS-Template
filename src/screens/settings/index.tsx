import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TextView from '@atoms/TextView';

const Settings = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Settings'} />
    </View>
  );
};

export default Settings;
