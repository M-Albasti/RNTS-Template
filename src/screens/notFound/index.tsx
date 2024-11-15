import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TouchableText from '@atoms/TouchableText';
import TextView from '@atoms/TextView';

const NotFound = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Not Found!'} />
      <TouchableText
        text={'Go Back To Home'}
        onPress={() => {
          props.navigation.goBack();
        }}
      />
    </View>
  );
};

export default NotFound;
