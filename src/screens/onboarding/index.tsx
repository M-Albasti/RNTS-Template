//@ts-nocheck Mahmoud need to be checked
//* packages import
import React, {useRef} from 'react';
import {Image, View} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {useTranslation} from 'react-i18next';

//* constants import
import {appColors} from '@constants/colors';

//* styles import
import {styles} from './styles';

const OnBoarding = (props: any): React.JSX.Element => {
  const {t} = useTranslation();
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
            title: t('onboarding.slide1Title'),
            subtitle: t('onboarding.slide1Subtitle'),
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
            title: t('onboarding.slide2Title'),
            subtitle: t('onboarding.slide2Subtitle'),
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
            title: t('onboarding.slide3Title'),
            subtitle: t('onboarding.slide3Subtitle'),
          },
        ]}
        onDone={() => props.navigation.replace('LoginOptions')}
        containerStyles={styles.onBoardingContainer}
        bottomBarHighlight={false}
        imageContainerStyles={styles.imageOnBoardingContainer}
      />
    </View>
  );
};

export default OnBoarding;
