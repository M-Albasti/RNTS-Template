//* packages import
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenWidth} from '@rneui/base';

//* components import
import TouchableText from '@atoms/TouchableText';

//* constants import
import {appColors} from '@constants/colors';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodsButtonsProps {
  // Define any props you need here
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethodsButtons = (
  props: AuthMethodsButtonsProps,
): React.JSX.Element => {
  const navigateToFirebaseLogin = () => {
    console.log('firebase Login');
    props.navigation.navigate('FirebaseAuthStack');
  };

  return (
    <View style={styles.container}>
      <TouchableText
        text="Login with Firebase"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={navigateToFirebaseLogin}
      />
      <TouchableText
        text="Login with SubaBase"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={() => console.log('Login with SubaBase')}
      />
      <TouchableText
        text="Login with FastApi"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={() => console.log('Login with FastApi')}
      />
      <TouchableText
        text="Login with Google"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={() => console.log('Login with Google')}
      />
      <TouchableText
        text="Login with Apple"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={() => console.log('Login with Apple')}
      />
      <TouchableText
        text="Login with Facebook"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={() => console.log('Login with Facebook')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  touchableConatinerStyle: {
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: appColors.primary,
    width: ScreenWidth * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  touchableTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AuthMethodsButtons;
