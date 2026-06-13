import React from 'react';
import {Linking, Platform, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import TextView from '@atoms/TextView';

import {
  getDriverBackgroundPermissionStatus,
  requestDriverBackgroundLocationPermission,
} from '@helpers/locationHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';

type Props = {
  visible: boolean;
};

const DriverBackgroundPermissionCard = ({visible}: Props): React.JSX.Element | null => {
  const {t} = useTranslation();
  const [status, setStatus] = React.useState<{foreground: boolean; background: boolean} | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const styles = useThemedStyles(tokens => ({
    card: {gap: tokens.spacing.sm},
  }));

  React.useEffect(() => {
    if (!visible) {
      setStatus(null);
      return;
    }
    void getDriverBackgroundPermissionStatus().then(setStatus);
  }, [visible]);

  if (!visible || status?.background) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <TextView text={t('delivery.backgroundLocationTitle')} variant="h3" />
      <TextView text={t('delivery.backgroundLocationBody')} variant="bodySmall" muted />
      {Platform.OS === 'android' && !status?.foreground ? (
        <TextView text={t('delivery.backgroundLocationStepFine')} variant="caption" muted />
      ) : null}
      {Platform.OS === 'android' && status?.foreground && !status.background ? (
        <TextView text={t('delivery.backgroundLocationStepBackground')} variant="caption" muted />
      ) : null}
      <View>
        <Button
          label={t('delivery.enableBackgroundTracking')}
          loading={loading}
          onPress={async () => {
            setLoading(true);
            const next = await requestDriverBackgroundLocationPermission();
            setStatus(next);
            setLoading(false);
          }}
        />
        <Button
          label={t('delivery.openSettings')}
          variant="ghost"
          onPress={() => {
            void Linking.openSettings();
          }}
        />
      </View>
    </Card>
  );
};

export default DriverBackgroundPermissionCard;
