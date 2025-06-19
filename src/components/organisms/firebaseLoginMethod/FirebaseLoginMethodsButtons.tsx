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
import {loginService} from '@services/authServices/loginService';
import {useAppDispatch} from '@hooks/useAppDispatch';

interface FirebaseLoginMethodsButtonsProps {
  // Define any props you need here
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodsButtons = (
  props: FirebaseLoginMethodsButtonsProps,
): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const navigateToEmailLogin = () => {
    // Replace with your navigation logic
    console.log('Navigate to Email Login');
    props.navigation.navigate('FirebaseEmailLogin');
  };

  const navigateToPhoneLogin = () => {
    // Replace with your navigation logic
    console.log('Navigate to Phone Login');
    props.navigation.navigate('FirebasePhoneLogin');
  };

  const navigateToFacebookLogin = () => {
    // Replace with your navigation logic
    loginService('FirebaseFacebook', dispatch);
    console.log('Navigate to Facebook Login');
  };

  const navigateToGoogleLogin = () => {
    // Replace with your navigation logic
    loginService('FirebaseGoogle', dispatch);
    console.log('Navigate to Google Login');
  };

  const navigateToAppleLogin = () => {
    // Replace with your navigation logic
    loginService('FirebaseApple', dispatch);
    console.log('Navigate to Apple Login');
  };

  return (
    <View style={styles.container}>
      <TouchableText
        text="Login with Email"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={navigateToEmailLogin}
      />
      <TouchableText
        text="Login with Facebook"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={navigateToFacebookLogin}
      />
      <TouchableText
        text="Login with Google"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={navigateToGoogleLogin}
      />
      <TouchableText
        text="Login with Phone"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={navigateToPhoneLogin}
      />
      <TouchableText
        text="Login with Apple"
        touchableStyle={styles.touchableConatinerStyle}
        textStyle={styles.touchableTextStyle}
        onPress={navigateToAppleLogin}
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

export default FirebaseLoginMethodsButtons;
