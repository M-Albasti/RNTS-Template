import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import CameraPermissionGate from '@molecules/camera/CameraPermissionGate';
import CodeScanOverlay from '@molecules/camera/CodeScanOverlay';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';

import {BARCODE_CODE_TYPES} from '@constants/cameraFilters';
import {
  AnalyticsEvents,
  logAnalyticsEvent,
  logScreenView,
} from '@services/firebaseServices/firebaseAnalyticsService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveBarcodeScannerStyles} from './styles/resolveBarcodeScannerStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type BarcodeScannerProps = {
  navigation: AppStackNavigationProp<'BarcodeScanner'>;
};

const BarcodeScanner = ({navigation}: BarcodeScannerProps): React.JSX.Element => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const cameraPermission = useCameraPermission();
  const device = useCameraDevice('back');
  const lastValueRef = useRef<string | null>(null);
  const [scanResult, setScanResult] = useState<{value: string; type: string} | null>(
    null,
  );

  const styles = useThemedStyles(resolveBarcodeScannerStyles);

  useEffect(() => {
    logScreenView('BarcodeScanner');
  }, []);

  const onCodeScanned = useCallback((codes: {value?: string; type?: string}[]) => {
    const code = codes.find(item => item.value);
    if (!code?.value || code.value === lastValueRef.current) {
      return;
    }
    lastValueRef.current = code.value;
    setScanResult({value: code.value, type: code.type ?? 'barcode'});
    void logAnalyticsEvent(AnalyticsEvents.cameraBarcodeScanned, {
      type: code.type ?? 'unknown',
    });
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: [...BARCODE_CODE_TYPES],
    onCodeScanned,
  });

  const requestPermission = useCallback(async () => {
    await cameraPermission.requestPermission();
  }, [cameraPermission]);

  const resetScan = () => {
    lastValueRef.current = null;
    setScanResult(null);
  };

  const copyValue = () => {
    if (!scanResult) {
      return;
    }
    Clipboard.setString(scanResult.value);
    Alert.alert(t('camera.copiedTitle'), t('camera.copiedBody'));
  };

  if (!device) {
    return (
      <View style={styles.root}>
        <TextView text={t('camera.noDevice')} />
      </View>
    );
  }

  const cameraActive = isFocused && !scanResult;

  return (
    <CameraPermissionGate
      hasPermission={cameraPermission.hasPermission}
      onRequest={requestPermission}>
      <View style={styles.root}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={cameraActive}
          codeScanner={codeScanner}
        />
        <View style={[styles.header, {paddingTop: insets.top}]}>
          <ScreenHeader
            title={t('camera.barcodeTitle')}
            onBack={() => navigation.goBack()}
          />
        </View>
        {!scanResult ? <View style={styles.line} pointerEvents="none" /> : null}
        {!scanResult ? (
          <View style={[styles.hint, {bottom: insets.bottom + 48}]}>
            <TextView
              text={t('camera.barcodeHint')}
              align="center"
              style={styles.hintText}
            />
          </View>
        ) : null}
        {scanResult ? (
          <CodeScanOverlay
            title={t('camera.barcodeResult')}
            value={scanResult.value}
            typeLabel={scanResult.type.toUpperCase()}
            onCopy={copyValue}
            onDismiss={() => navigation.goBack()}
            onScanAgain={resetScan}
          />
        ) : null}
      </View>
    </CameraPermissionGate>
  );
};

export default BarcodeScanner;
