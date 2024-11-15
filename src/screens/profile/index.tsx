import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';

const Profile = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Profile'} />
      <TouchableText
        text={'open settings'}
        onPress={() => {
          props.navigation.navigate('Settings');
        }}
      />
      <TouchableText
        text={'open Drawer'}
        onPress={() => {
          props.navigation.openDrawer();
        }}
      />
    </View>
  );
};

export default Profile;
