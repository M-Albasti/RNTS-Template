import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import CompassHeading from 'react-native-compass-heading';
import Svg, {Circle, Line, Polygon} from 'react-native-svg';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {
  formatBearingLabel,
  getQiblaBearingDegrees,
  getQiblaNeedleRotation,
} from '@helpers/qiblaHelpers';
import {
  isPrayerLocationConfigured,
  resolvePrayerLocation,
} from '@helpers/prayerLocationHelpers';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'Qibla'>};

/**
 * Live Qibla compass using device heading + Kaaba bearing from saved location.
 */
const Qibla = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, spacing} = useThemeTokens();
  const islamic = useAppSelector(state => state.islamic);
  const location = resolvePrayerLocation(islamic);
  const configured = isPrayerLocationConfigured(location);
  const [heading, setHeading] = useState<number | null>(null);
  const [sensorFailed, setSensorFailed] = useState(false);

  const hasCoords =
    configured && location.latitude != null && location.longitude != null;

  const qiblaBearing = useMemo(() => {
    if (!hasCoords) {
      return 0;
    }
    return getQiblaBearingDegrees(location.latitude as number, location.longitude as number);
  }, [hasCoords, location.latitude, location.longitude]);

  const needleRotation =
    heading == null ? 0 : getQiblaNeedleRotation(qiblaBearing, heading);

  useEffect(() => {
    if (!hasCoords) {
      return;
    }
    let gotSample = false;
    setHeading(null);
    setSensorFailed(false);

    const timeoutId = setTimeout(() => {
      if (!gotSample) {
        setSensorFailed(true);
      }
    }, 5000);

    try {
      CompassHeading.start(3, ({heading: next}: {heading: number}) => {
        gotSample = true;
        setSensorFailed(false);
        setHeading(next);
      });
    } catch (error) {
      console.log('Qibla CompassHeading.start Error =>', error);
      setSensorFailed(true);
    }
    return () => {
      clearTimeout(timeoutId);
      try {
        CompassHeading.stop();
      } catch {
        // ignore
      }
    };
  }, [hasCoords]);

  const styles = useThemedStyles(tokens => ({
    body: {
      alignItems: 'center' as const,
      padding: tokens.spacing.lg,
    },
    dialWrap: {
      width: tokens.spacing.xxxl * 5,
      height: tokens.spacing.xxxl * 5,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginVertical: tokens.spacing.xl,
    },
    needleLayer: {
      position: 'absolute' as const,
      width: tokens.spacing.xxxl * 5,
      height: tokens.spacing.xxxl * 5,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    card: {
      width: '100%' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    meta: {textAlign: 'center' as const},
  }));

  const size = spacing.xxxl * 5;
  const center = size / 2;
  const radius = size / 2 - spacing.md;

  if (!hasCoords) {
    return (
      <ScreenContainer scroll bottomPadding="xxl">
        <ScreenHeader title={t('islamic.prayer.qiblaTitle')} navigation={navigation} />
        <View style={styles.body}>
          <View style={styles.card}>
            <TextView text={t('islamic.prayer.qiblaNeedLocation')} variant="body" />
            <Spacer size="md" />
            <Button
              label={t('islamic.prayer.chooseLocation')}
              onPress={() => navigation.navigate('PrayerLocationSetup')}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('islamic.prayer.qiblaTitle')} navigation={navigation} />
      <View style={styles.body}>
        <TextView
          text={location.label || `${location.city}, ${location.country}`}
          variant="caption"
          muted
          style={styles.meta}
        />
        <Spacer size="sm" />
        <TextView
          text={t('islamic.prayer.qiblaBearing', {degrees: formatBearingLabel(qiblaBearing)})}
          variant="body"
          style={styles.meta}
        />

        {sensorFailed ? (
          <>
            <Spacer size="lg" />
            <IslamicErrorState message={t('islamic.prayer.qiblaSensorUnavailable')} />
          </>
        ) : heading == null ? (
          <>
            <Spacer size="lg" />
            <IslamicLoadingState />
            <Spacer size="sm" />
            <TextView
              text={t('islamic.prayer.qiblaSensorLoading')}
              variant="caption"
              muted
              style={styles.meta}
            />
          </>
        ) : (
          <>
            <View style={styles.dialWrap}>
              <Svg width={size} height={size}>
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={colors.borderStrong}
                  strokeWidth={2}
                  fill={colors.prayerActiveMuted}
                />
                <Circle
                  cx={center}
                  cy={center}
                  r={radius * 0.7}
                  stroke={colors.border}
                  strokeWidth={1}
                  fill="none"
                />
                <Line
                  x1={center}
                  y1={spacing.sm}
                  x2={center}
                  y2={spacing.lg}
                  stroke={colors.textMuted}
                  strokeWidth={2}
                />
              </Svg>
              <View
                style={[
                  styles.needleLayer,
                  {transform: [{rotate: `${needleRotation}deg`}]},
                ]}
                pointerEvents="none">
                <Svg width={size} height={size}>
                  <Polygon
                    points={`${center},${center - radius + spacing.md} ${center - spacing.sm},${center + spacing.xs} ${center + spacing.sm},${center + spacing.xs}`}
                    fill={colors.prayerAccent}
                  />
                  <Circle cx={center} cy={center} r={6} fill={colors.prayerHero} />
                </Svg>
              </View>
            </View>

            <View style={styles.card}>
              <TextView text={t('islamic.prayer.qiblaHint')} variant="bodySmall" muted />
              <Spacer size="xs" />
              <TextView
                text={t('islamic.prayer.qiblaDeviceHeading', {
                  degrees: formatBearingLabel(heading),
                })}
                variant="caption"
                muted
              />
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
};

export default Qibla;
