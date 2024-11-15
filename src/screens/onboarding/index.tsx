import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from './styles';
import Onboarding from 'react-native-onboarding-swiper';

const OnBoarding = (props: any): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Onboarding
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <Image source={require('../../assets/images/onboarding1.jpg')} />
            ),
            title: 'Onboarding1',
            subtitle: 'Done with React Native Onboarding Swiper1',
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image source={require('../../assets/images/onboarding2.jpg')} />
            ),
            title: 'Onboarding2',
            subtitle: 'Done with React Native Onboarding Swiper2',
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image source={require('../../assets/images/onboarding3.jpg')} />
            ),
            title: 'Onboarding3',
            subtitle: 'Done with React Native Onboarding Swiper3',
          },
        ]}
        containerStyles={styles.onBoardingContainer}
        imageContainerStyles={styles.imageOnBoardingContainer}
      />
    </View>
  );
};

export default OnBoarding;
