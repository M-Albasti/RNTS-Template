//* packages import
import React, {useRef} from 'react';
import {Image, View} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {ScreenHeight, ScreenWidth} from '@rneui/base';
import {useTranslation} from 'react-i18next';

import {useThemeTokens} from '@theme/useThemeTokens';

//* styles import
import {styles} from './styles';

import type {AppStackNavigationProp} from '@Types/appNavigation';

interface OnBoardingProps {
  navigation: AppStackNavigationProp<'OnBoarding'>;
}

const OnBoarding = ({navigation}: OnBoardingProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();
  const onBoardingRef = useRef<Onboarding | null>(null);

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
            backgroundColor: colors.transparent,
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
            backgroundColor: colors.transparent,
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
            backgroundColor: colors.transparent,
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
        onDone={() => navigation.replace('LoginOptions')}
        containerStyles={styles.onBoardingContainer}
        bottomBarHighlight={false}
        imageContainerStyles={styles.imageOnBoardingContainer}
      />
    </View>
  );
};

export default OnBoarding;
