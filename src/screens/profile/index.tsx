import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const Profile = (props: any): React.JSX.Element => {
  console.log('🚀 ~ Profile ~ props:', props);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Settings');
        }}>
        <Text>open settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.getParent('DrawerRoot').openDrawer();
        }}>
        <Text>open Drawer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
