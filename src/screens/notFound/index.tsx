import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const NotFound = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>NotFound</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}>
        <Text>Go Back To Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotFound;
