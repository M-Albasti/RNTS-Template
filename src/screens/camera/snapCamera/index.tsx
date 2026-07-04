import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import CameraFilterOverlay from '@molecules/camera/CameraFilterOverlay';
import CameraPermissionGate from '@molecules/camera/CameraPermissionGate';
import TextView from '@atoms/TextView';

import {
  CAMERA_FILTERS,
  type CameraFilterId,
} from '@constants/cameraFilters';
import {savePhotoToGallery} from '@helpers/cameraHelpers';
import {
  AnalyticsEvents,
  logAnalyticsEvent,
  logScreenView,
} from '@services/firebaseServices/firebaseAnalyticsService';
import {recordCrashError} from '@services/firebaseServices/firebaseCrashlyticsService';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveSnapCameraStyles} from './styles/resolveSnapCameraStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type SnapCameraProps = {
  navigation: AppStackNavigationProp<'SnapCamera'>;
};

const SnapCamera = ({navigation}: SnapCameraProps): React.JSX.Element => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const cameraPermission = useCameraPermission();
  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera | null>(null);
  const [filterId, setFilterId] = useState<CameraFilterId>('none');
  const [capturing, setCapturing] = useState(false);
  const [layout, setLayout] = useState({width: 0, height: 0});

  const {spacing} = useThemeTokens();
  const styles = useThemedStyles(resolveSnapCameraStyles);

  useEffect(() => {
    logScreenView('SnapCamera');
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setLayout({width, height});
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || capturing || !isFocused) {
      return;
    }

    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePhoto({flash: 'off', enableShutterSound: false});
      await savePhotoToGallery(photo.path);
      await logAnalyticsEvent(AnalyticsEvents.cameraSnapCaptured, {
        filter: filterId,
      });
      Alert.alert(t('camera.savedTitle'), t('camera.savedBody'));
    } catch (error) {
      recordCrashError(error, 'SnapCamera.capturePhoto');
      Alert.alert(t('camera.errorTitle'), t('camera.captureFailed'));
    } finally {
      setCapturing(false);
    }
  };

  const selectFilter = async (id: CameraFilterId) => {
    setFilterId(id);
    await logAnalyticsEvent(AnalyticsEvents.cameraFilterChanged, {filter: id});
  };

  const requestPermission = useCallback(async () => {
    await cameraPermission.requestPermission();
  }, [cameraPermission]);

  const filterRailBottom = insets.bottom + spacing.xxxl * 2 + spacing.xxl;
  const shutterBottom = insets.bottom + spacing.xl;

  if (!device) {
    return (
      <View style={styles.root}>
        <TextView text={t('camera.noDevice')} containerStyle={styles.root} />
      </View>
    );
  }

  return (
    <CameraPermissionGate
      hasPermission={cameraPermission.hasPermission}
      onRequest={requestPermission}>
      <View style={styles.root} onLayout={onLayout}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          photo
          enableZoomGesture
        />
        {layout.width > 0 ? (
          <CameraFilterOverlay
            filterId={filterId}
            width={layout.width}
            height={layout.height}
          />
        ) : null}

        <View style={[styles.topBar, {top: insets.top + spacing.sm}]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={spacing.md}>
            <TextView text={t('common.goBack')} style={styles.overlayText} />
          </Pressable>
          <TextView text={t('camera.snapTitle')} style={styles.overlayText} />
        </View>

        <FlatList
          horizontal
          data={CAMERA_FILTERS}
          keyExtractor={item => item.id}
          style={[styles.filterRail, {bottom: filterRailBottom}]}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable
              accessibilityLabel={t(item.labelKey)}
              style={[
                styles.filterChip,
                filterId === item.id && styles.filterChipActive,
              ]}
              onPress={() => selectFilter(item.id)}>
              <TextView text={item.preview} variant="h3" />
            </Pressable>
          )}
        />

        <View style={[styles.shutterRow, {bottom: shutterBottom}]}>
          <Pressable
            accessibilityLabel={t('camera.snapTitle')}
            style={[styles.shutter, capturing && styles.shutterDisabled]}
            onPress={capturePhoto}
            disabled={capturing}
          />
        </View>
      </View>
    </CameraPermissionGate>
  );
};

export default SnapCamera;
