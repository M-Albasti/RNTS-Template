//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import TextView from '@atoms/TextView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';
import RegisterTemplate from '@templates/auth/registerTemplate';

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
      />
    </View>
  );
};

export default FirebaseEmailRegister;
