import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {
  getRemoteConfigBoolean,
  refreshRemoteConfig,
} from '@config/firebaseInit';
import {logScreenView} from '@services/firebaseServices/firebaseAnalyticsService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveCameraHubStyles} from './styles/resolveCameraHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type CameraHubProps = {
  navigation: AppStackNavigationProp<'CameraHub'>;
};

const CameraHub = ({navigation}: CameraHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [snapEnabled, setSnapEnabled] = useState(() =>
    getRemoteConfigBoolean('camera_snap_enabled'),
  );
  const [qrEnabled, setQrEnabled] = useState(() =>
    getRemoteConfigBoolean('camera_qr_enabled'),
  );
  const [barcodeEnabled, setBarcodeEnabled] = useState(() =>
    getRemoteConfigBoolean('camera_barcode_enabled'),
  );

  const syncFeatureFlags = useCallback(() => {
    setSnapEnabled(getRemoteConfigBoolean('camera_snap_enabled'));
    setQrEnabled(getRemoteConfigBoolean('camera_qr_enabled'));
    setBarcodeEnabled(getRemoteConfigBoolean('camera_barcode_enabled'));
  }, []);

  const styles = useThemedStyles(resolveCameraHubStyles);

  useEffect(() => {
    logScreenView('CameraHub');
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshRemoteConfig().then(syncFeatureFlags);
    }, [syncFeatureFlags]),
  );

  const hasAnyFeature = snapEnabled || qrEnabled || barcodeEnabled;

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('camera.title')} showBack={false} showDrawer navigation={navigation} />
      <View style={styles.hero}>
        <Heading text={t('camera.hubTitle')} level="h2" align="center" />
        <Spacer size="xs" />
        <TextView text={t('camera.hubSubtitle')} align="center" muted />
      </View>
      <Spacer size="lg" />
      {hasAnyFeature ? (
        <View style={styles.grid}>
          {snapEnabled ? (
            <FeatureHubCard
              title={t('camera.snapTitle')}
              subtitle={t('camera.snapSubtitle')}
              iconType="Ionicons"
              iconName="happy-outline"
              onPress={() => navigation.navigate('SnapCamera')}
            />
          ) : null}
          {qrEnabled ? (
            <FeatureHubCard
              title={t('camera.qrTitle')}
              subtitle={t('camera.qrSubtitle')}
              iconType="Ionicons"
              iconName="qr-code-outline"
              onPress={() => navigation.navigate('QrScanner')}
            />
          ) : null}
          {barcodeEnabled ? (
            <FeatureHubCard
              title={t('camera.barcodeTitle')}
              subtitle={t('camera.barcodeSubtitle')}
              iconType="MaterialCommunityIcons"
              iconName="barcode-scan"
              onPress={() => navigation.navigate('BarcodeScanner')}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.empty}>
          <TextView text={t('camera.noFeatures')} align="center" muted />
        </View>
      )}
    </ScreenContainer>
  );
};

export default CameraHub;
