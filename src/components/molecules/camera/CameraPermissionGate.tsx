import React from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import TextView from '@atoms/TextView';

import {permissionsRequest} from '@helpers/permissionsRequest';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveCameraPermissionGateStyles} from './styles/resolveCameraPermissionGateStyles';

type CameraPermissionGateProps = {
  hasPermission: boolean;
  onRequest: () => Promise<void>;
  children: React.ReactNode;
};

const CameraPermissionGate = ({
  hasPermission,
  onRequest,
  children,
}: CameraPermissionGateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [attempted, setAttempted] = React.useState(false);
  const styles = useThemedStyles(resolveCameraPermissionGateStyles);

  if (hasPermission) {
    return <>{children}</>;
  }

  const request = async () => {
    setLoading(true);
    try {
      await permissionsRequest('camera');
      await onRequest();
    } finally {
      setLoading(false);
      setAttempted(true);
    }
  };

  const showSettings = attempted && !hasPermission;

  return (
    <View style={styles.gate}>
      <TextView text={t('camera.permissionTitle')} variant="h3" align="center" />
      <TextView text={t('camera.permissionBody')} variant="bodySmall" align="center" muted />
      {showSettings ? (
        <TextView text={t('camera.permissionDenied')} variant="bodySmall" align="center" muted />
      ) : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Button label={t('camera.grantPermission')} onPress={request} />
          {showSettings ? (
            <Button
              label={t('camera.openSettings')}
              variant="ghost"
              onPress={() => {
                void Linking.openSettings();
              }}
            />
          ) : null}
        </>
      )}
    </View>
  );
};

export default CameraPermissionGate;
