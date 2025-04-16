//* packages import
import React, {useRef} from 'react';
import {Image, View} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {ScreenHeight, ScreenWidth} from '@rneui/base';

//* constants import
import {appColors} from '@constants/colors';

//* styles import
import {styles} from './styles';

const OnBoarding = (props: any): React.JSX.Element => {
  const onBoardingRef = useRef<Onboarding>();

  const onOnboardingReady = (ref: Onboarding) => {
    onBoardingRef.current = ref;
  };

  return (
    <View style={styles.container}>
      <Onboarding
        ref={(ref: Onboarding | null) => {
          if (!!ref) {
            onOnboardingReady(ref);
          }
        }}
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
        onDone={() => props.navigation.navigate('AuthMethod')}
        containerStyles={styles.onBoardingContainer}
        bottomBarHighlight={false}
        imageContainerStyles={styles.imageOnBoardingContainer}
      />
    </View>
  );
};

export default OnBoarding;
