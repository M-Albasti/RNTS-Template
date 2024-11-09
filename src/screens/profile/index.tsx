import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const Profile = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Settings');
        }}>
        <Text>open settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.openDrawer();
        }}>
        <Text>open Drawer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
