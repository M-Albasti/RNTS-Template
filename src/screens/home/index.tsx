//* packages import
import React, {useCallback} from 'react';
import {I18nManager, Text, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import {isEmpty} from 'lodash';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* services import
import {logoutService} from '@services/authServices/logoutService';
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {changeLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

interface HomeProps {
  navigation: AppStackNavigationProp<'Home'>;
}

const SLIDE_KEYS = ['slide1', 'slide2', 'slide3'] as const;

const Home = ({navigation}: HomeProps): React.JSX.Element => {
  const user = useAppSelector(state => state?.auth?.user);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    actions: {
      gap: tokens.spacing.sm,
    },
    explore: {
      gap: tokens.spacing.sm,
    },
    swiper: {
      height: 180,
      marginTop: tokens.spacing.md,
    },
    slide: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderRadius: tokens.radius.lg,
      marginHorizontal: tokens.spacing.xs,
    },
    slideOne: {
      backgroundColor: tokens.colors.accent1,
    },
    slideTwo: {
      backgroundColor: tokens.colors.accent2,
    },
    slideThree: {
      backgroundColor: tokens.colors.accent3,
    },
    slideText: {
      ...tokens.typography.h2,
      color: tokens.colors.textInverse,
    },
  }));

  const logout = useCallback(() => {
    if (!isEmpty(user)) {
      logoutService(user?.loginType, dispatch);
    }
  }, [dispatch, user]);

  const slideStyles = [styles.slideOne, styles.slideTwo, styles.slideThree];
  const slideLabels = ['Hello', 'Beautiful', 'RNTS'];

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <Heading text={t('Home', {defaultValue: 'Home'})} level="h1" />
      {user?.email ? (
        <>
          <Spacer size="xs" />
          <TextView text={user.email} variant="bodySmall" muted />
        </>
      ) : null}

      <Spacer size="lg" />

      <Card>
        <Heading text="Quick actions" level="h3" />
        <Spacer size="md" />
        <View style={styles.actions}>
          <Button
            label="Go to Profile"
            fullWidth
            onPress={() => navigation.getParent()?.navigate('Profile')}
          />
          <Button
            label="Change language"
            variant="secondary"
            fullWidth
            onPress={() => changeLanguage(dispatch)}
          />
          <Button label="Logout" variant="outline" fullWidth onPress={logout} />
        </View>
      </Card>

      <Spacer size="lg" />

      <Card>
        <Heading text="Explore" level="h3" />
        <Spacer size="md" />
        <View style={styles.explore}>
          <Button
            label="Open menu"
            variant="secondary"
            fullWidth
            onPress={() => {
              const drawer = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();
              drawer?.openDrawer();
            }}
          />
          <Button
            label="Videos library"
            fullWidth
            onPress={() => navigation.getParent()?.navigate('VideoStack')}
          />
          <Button
            label="Audios library"
            fullWidth
            onPress={() => navigation.getParent()?.navigate('AudioStack')}
          />
          <Button
            label="Settings"
            variant="outline"
            fullWidth
            onPress={() => rootNavigate('Settings', undefined)}
          />
        </View>
      </Card>

      <Spacer size="lg" />

      <Swiper
        style={styles.swiper}
        showsPagination
        autoplay={isFocused}
        loop
        horizontal
        autoplayDirection={!I18nManager.isRTL}>
        {SLIDE_KEYS.map((key, index) => (
          <View key={key} style={[styles.slide, slideStyles[index]]}>
            <Text style={styles.slideText}>{slideLabels[index]}</Text>
          </View>
        ))}
      </Swiper>
    </ScreenContainer>
  );
};

export default Home;
