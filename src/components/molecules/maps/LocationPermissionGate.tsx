import React from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import TextView from '@atoms/TextView';

import {requestLocationPermission} from '@helpers/locationHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';

type LocationPermissionGateProps = {
  children: React.ReactNode;
};

const LocationPermissionGate = ({
  children,
}: LocationPermissionGateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [granted, setGranted] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  const styles = useThemedStyles(tokens => ({
    gate: {
      ...tokens.layout.presets.center,
      ...tokens.layout.presets.fill,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
      backgroundColor: tokens.colors.background,
    },
  }));

  React.useEffect(() => {
    void requestLocationPermission().then(setGranted);
  }, []);

  if (granted === null) {
    return (
      <View style={styles.gate}>
        <ActivityIndicator />
      </View>
    );
  }

  if (granted) {
    return <>{children}</>;
  }

  return (
    <View style={styles.gate}>
      <TextView text={t('delivery.locationTitle')} variant="h3" align="center" />
      <TextView text={t('delivery.locationBody')} variant="bodySmall" align="center" muted />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Button
            label={t('delivery.grantLocation')}
            onPress={async () => {
              setLoading(true);
              const ok = await requestLocationPermission();
              setGranted(ok);
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
        </>
      )}
    </View>
  );
};

export default LocationPermissionGate;
