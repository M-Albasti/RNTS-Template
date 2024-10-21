import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';

const NotFound = (props: any): React.JSX.Element => {
  console.log('🚀 ~ NotFound ~ props:', props);
  return (
    <SafeAreaView style={styles.container}>
      <Text>NotFound</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}>
        <Text>Go Back To Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotFound;
