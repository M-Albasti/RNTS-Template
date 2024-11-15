import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TouchableText from '@atoms/TouchableText';
import TextView from '@atoms/TextView';

const Home = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextView text={'Home'} />
      <TouchableText
        text={'Go To Profile'}
        onPress={() => {
          props.navigation.navigate('DrawerRoot', {
            screen: 'Profile',
            initial: false,
          });
        }}
      />
    </View>
  );
};

export default Home;
