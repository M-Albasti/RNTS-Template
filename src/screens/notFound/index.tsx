//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import TouchableText from '@atoms/TouchableText';
import TextView from '@atoms/TextView';

//* styles import
import {styles} from './styles';

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
