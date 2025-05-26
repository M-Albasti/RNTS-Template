//* packages import
import React from 'react';
import {I18nManager, Text, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {isEmpty} from 'lodash';

//* components import
import TouchableText from '@atoms/TouchableText';
import TextView from '@atoms/TextView';

//* services import
import {logoutService} from '@services/authServices/logoutService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {changeLanguage} from '@translation/i18n';

//* styles import
import {styles} from './styles';

const Home = (props: any): React.JSX.Element => {
  const user = useAppSelector(state => state?.auth?.user);
  const dispatch = useAppDispatch();

  const logout = () => {
    if (!isEmpty(user)) {
      logoutService(user?.loginType, dispatch);
    }
  };

  return (
    <View style={styles.container}>
      <TextView text={'Home'} />
      <TouchableText
        text={'Go To Profile'}
        onPress={() => {
          props.navigation.navigate('DrawerRoot', {
            screen: 'Profile',
            initial: false,
          });
        }}
      />
      <TouchableText text={'Logout'} onPress={logout} />
      <TouchableText
        text={'change language'}
        onPress={() => {
          changeLanguage(dispatch);
        }}
      />

      <Swiper
        style={styles.wrapper}
        showsPagination={false}
        showsButtons={false}
        autoplay
        loop
        directionalLockEnabled={true}
        disableIntervalMomentum
        horizontal
        removeClippedSubviews
        bounces
        bouncesZoom
        disableScrollViewPanResponder
        autoplayDirection={I18nManager.isRTL ? false : true}
        alwaysBounceHorizontal
        fadingEdgeLength={1}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Hello Swiper</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Beautiful</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>
      </Swiper>
    </View>
  );
};

export default Home;
