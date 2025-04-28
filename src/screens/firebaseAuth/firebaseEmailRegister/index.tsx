//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import RegisterTemplate from '@templates/auth/registerTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface RegisterProps {
  navigation: AppStackNavigationProp<'FirebaseEmailRegister'>;
}

const FirebaseEmailRegister = (props: RegisterProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <RegisterTemplate
        navigation={props.navigation}
        registerType={{
          key: 'FirebaseEmailRegister',
          name: 'FirebaseEmailRegister',
        }}
        keyboardType={'email-address'}
      />
    </View>
  );
};

export default FirebaseEmailRegister;
