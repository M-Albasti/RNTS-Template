import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from './styles';
import Onboarding from 'react-native-onboarding-swiper';
import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {appColors} from '@constants/colors';

const OnBoarding = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Onboarding
        pages={[
          {
            backgroundColor: appColors.transparent,
            image: (
              <Image
                source={require('@assets/images/onboarding1.jpg')}
                resizeMode="stretch"
                style={{width: ScreenWidth, height: ScreenHeight / 2}}
              />
            ),
            title: 'Onboarding1',
            subtitle: 'Done with React Native Onboarding Swiper1',
          },
          {
            backgroundColor: appColors.transparent,
            image: (
              <Image
                source={require('@assets/images/onboarding2.jpg')}
                resizeMode="stretch"
                style={{width: ScreenWidth, height: ScreenHeight / 2}}
              />
            ),
            title: 'Onboarding2',
            subtitle: 'Done with React Native Onboarding Swiper2',
          },
          {
            backgroundColor: appColors.transparent,
            image: (
              <Image
                source={require('@assets/images/onboarding3.jpg')}
                resizeMode="stretch"
                style={{width: ScreenWidth, height: ScreenHeight / 2}}
              />
            ),
            title: 'Onboarding3',
            subtitle: 'Done with React Native Onboarding Swiper3',
          },
        ]}
        onDone={() => props.navigation.navigate('Login')}
        containerStyles={styles.onBoardingContainer}
        bottomBarHighlight={false}
        imageContainerStyles={styles.imageOnBoardingContainer}
      />
    </View>
  );
};

export default OnBoarding;
