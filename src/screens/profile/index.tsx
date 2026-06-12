//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Divider from '@atoms/Divider';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';

import {DrawerNavigationProp} from '@react-navigation/drawer';

//* hooks import
import {useAppSelector} from '@hooks/useAppSelector';

//* services import
import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

interface ProfileProps {
  navigation: AppStackNavigationProp<'Profile'> &
    Partial<Pick<DrawerNavigationProp<DrawerParamList>, 'openDrawer'>>;
}

const Profile = ({navigation}: ProfileProps): React.JSX.Element => {
  const user = useAppSelector(state => state.auth.user);
  const styles = useThemedStyles(tokens => ({
    avatar: {
      width: 72,
      height: 72,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.primaryMuted,
      alignSelf: 'center' as const,
    },
    actions: {
      gap: tokens.spacing.sm,
    },
  }));

  return (
    <ScreenContainer scroll>
      <Heading text="Profile" level="h1" />
      <Spacer size="lg" />

      <Card>
        <View style={styles.avatar} />
        <Spacer size="md" />
        <Heading
          text={user?.displayName || user?.email || 'Guest user'}
          level="h3"
          align="center"
        />
        {user?.loginType ? (
          <>
            <Spacer size="xs" />
            <Heading
              text={`Signed in via ${user.loginType}`}
              level="h3"
              tone="muted"
              align="center"
            />
          </>
        ) : null}
      </Card>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      <View style={styles.actions}>
        <Button
          label="Open Settings"
          fullWidth
          onPress={() => rootNavigate('Settings', undefined)}
        />
        <Button
          label="Open Drawer"
          variant="secondary"
          fullWidth
          onPress={() => navigation.openDrawer?.()}
        />
      </View>
    </ScreenContainer>
  );
};

export default Profile;
