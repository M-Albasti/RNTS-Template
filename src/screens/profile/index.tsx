//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import TextView from '@atoms/TextView';
import TouchableText from '@atoms/TouchableText';

//* styles import
import {styles} from './styles';

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
