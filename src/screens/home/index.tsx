import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const Home = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('StackRoot', {
            screen: 'Profile',
            initial: false,
          });
        }}>
        <Text>Go To Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
