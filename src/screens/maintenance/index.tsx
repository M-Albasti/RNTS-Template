//* packages import
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import Icon from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* config import
import {getRemoteConfigString} from '@config/firebaseInit';
import {logScreenView} from '@services/firebaseServices/firebaseAnalyticsService';

//* theme import
import {useThemeTokens} from '@theme/useThemeTokens';

//* styles import
import {styles} from '@screens/maintenance/styles';

interface MaintenanceModeScreenProps {
  onRetry: () => Promise<void>;
  isRefreshing?: boolean;
}

const MaintenanceModeScreen = ({
  onRetry,
  isRefreshing = false,
}: MaintenanceModeScreenProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();
  const remoteMessage = getRemoteConfigString('maintenance_message');
  const showRemoteMessage = remoteMessage.trim().length > 0;

  useEffect(() => {
    void logScreenView('MaintenanceMode');
  }, []);

  return (
    <ScreenContainer centered alignContent="center" style={styles.container}>
      <Icon
        iconType="MaterialCommunityIcons"
        name="tools"
        size={56}
        color={colors.primary}
        iconContainerStyle={styles.iconContainer}
      />
      <Spacer size="md" />
      <Heading
        text={t('maintenance.title')}
        level="h1"
        tone="primary"
        align="center"
      />
      <Spacer size="sm" />
      <TextView
        text={t('maintenance.message')}
        variant="body"
        muted
        align="center"
      />
      {showRemoteMessage ? (
        <>
          <Spacer size="sm" />
          <TextView text={remoteMessage} variant="body" align="center" />
        </>
      ) : null}
      <Spacer size="xl" />
      <Button
        label={t('maintenance.retry')}
        onPress={() => {
          void onRetry();
        }}
        loading={isRefreshing}
        fullWidth
      />
    </ScreenContainer>
  );
};

export default MaintenanceModeScreen;
