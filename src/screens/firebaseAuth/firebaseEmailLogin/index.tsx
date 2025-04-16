//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import LoginTemplate from '@templates/auth/loginTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface LoginProps {
  navigation: AppStackNavigationProp<'FirebaseEmailLogin'>;
}

const FirebaseEmailLogin = (props: LoginProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <LoginTemplate
        navigation={props.navigation}
        registerType={{
          key: 'FirebaseEmailRegister',
          name: 'FirebaseEmailRegister',
        }}
      />
    </View>
  );
};

export default FirebaseEmailLogin;
