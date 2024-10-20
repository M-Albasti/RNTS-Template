import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const Profile = (props: any): React.JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('StackRoot', {
            screen: 'Settings',
            initial: false
          });
        }}>
        <Text>open settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
